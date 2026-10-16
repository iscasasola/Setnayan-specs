"""
kit_scenes.py — the Vintage (cale-ice) art kit as photoreal Blender cut-outs.

STATUS 2026-10-16: WRITTEN, NOT RUN. The HEAVY lane was held for live fixes all session, so no Blender
process was started. Expect a first run to need fixes (API names drift between Blender versions).
Run when the lane is yours:

    ~/Documents/Claude/Projects/heavy-lock.sh acquire HEAVY   # strict FIFO; release when done
    blender -b --python kit_scenes.py -- --piece column --out ./render --samples 96
    blender -b --python kit_scenes.py -- --piece all --out ./render
    ~/Documents/Claude/Projects/heavy-lock.sh release HEAVY

Each piece renders ONE transparent PNG at 2x its phone slot, front-on orthographic, lit as a studio
product shot (warm key from upper-left, cool fill, a thin rim), with a soft CONTACT SHADOW baked into the
alpha so the piece sits on the page. Encode after: `cwebp -q 76 -alpha_q 85` and `magick -quality 48 x.avif`.

The quality bar (owner's references, 2026-10-16): gilded carved metal, satin, lace, real-looking flowers,
studio-lit, each OVERLAPPING a card edge. Where procedural Blender falls short of that bar it is said in
the builder's docstring; the honest fix for the florals is a scanned/photographed asset or a commission.

Pieces (slot = CSS px on a 375 phone; render = 2x):
  drape          120 x 640   satin tieback curtain, Rosewood            sways (CSS)
  column          64 x 230   narra fluted column, capiz arch window     still
  seal            84 x 84    rosewood wax seal, blank centre            pressable (tap = unveil)
  rsvp           343 x 90    rose/sampaguita garland on a blush ribbon  floats
  corner         130 x 130   rose cluster, olive leaves, sampaguita     floats
  oval           300 x 380   gilt + lace oval frame, open centre        still
  chandelier     140 x 170   brass 6-arm candle chandelier (optional)   sways
  fan            160 x 110   lace fan, narra guard (optional)           still
"""
import bpy, bmesh, math, random, sys, os, argparse
from mathutils import Vector

# ---------- palette (cale-ice, live) ----------
HEX = dict(rosewood="5C0700", pandan="669C35", firebrick="B51A00", cream="F7F2EC", dusty="CFAFAF",
           oxblood="351115", olive="646B38", marigold="F3E5B9", blush="E6C0B3", garnet="803236", narra="6B4226",
           brass="B08D4A")
def rgb(h, a=1.0):
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (0, 2, 4))
    srgb = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return (srgb(r), srgb(g), srgb(b), a)

SLOTS = dict(drape=(120, 640), column=(64, 230), seal=(84, 84), rsvp=(343, 90), corner=(130, 130),
             oval=(300, 380), chandelier=(140, 170), fan=(160, 110))

# ---------- scene ----------
def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def setup(piece, samples):
    sc = bpy.context.scene
    w, h = SLOTS[piece]
    sc.render.engine = 'CYCLES'
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.render.film_transparent = True
    sc.render.resolution_x, sc.render.resolution_y = w * 2, h * 2
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'AgX' if 'AgX' in [i.identifier for i in sc.view_settings.bl_rna.properties['view_transform'].enum_items] else 'Filmic'
    sc.view_settings.look = 'None'
    # camera: orthographic, front-on, framing a (w/100) x (h/100) metre slot
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
    cam.data.type = 'ORTHO'
    cam.data.ortho_scale = max(w, h) / 100
    cam.location = (0, -10, 0)
    cam.rotation_euler = (math.radians(90), 0, 0)
    sc.collection.objects.link(cam)
    sc.camera = cam
    # studio: warm key, cool fill, thin rim; a dim warm world so metals have something to reflect
    def light(name, kind, energy, loc, rot, size=2.0, color=(1, 1, 1)):
        L = bpy.data.lights.new(name, kind); L.energy = energy; L.color = color
        if kind == 'AREA': L.size = size
        o = bpy.data.objects.new(name, L); o.location = loc; o.rotation_euler = rot
        sc.collection.objects.link(o); return o
    light("Key", 'AREA', 900, (-3, -5, 4), (math.radians(55), 0, math.radians(-30)), 3.0, (1.0, 0.93, 0.82))
    light("Fill", 'AREA', 250, (4, -6, 1), (math.radians(80), 0, math.radians(35)), 4.0, (0.86, 0.9, 1.0))
    light("Rim", 'AREA', 500, (2, 4, 3), (math.radians(-130), 0, math.radians(20)), 1.0, (1.0, 0.96, 0.9))
    world = bpy.data.worlds.new("W"); sc.world = world; world.use_nodes = True
    bg = world.node_tree.nodes["Background"]; bg.inputs[0].default_value = (0.9, 0.85, 0.78, 1); bg.inputs[1].default_value = 0.35
    # a shadow-catcher plane just behind the piece: the contact shadow lands in the alpha
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0.6, 0), rotation=(math.radians(90), 0, 0))
    catcher = bpy.context.object; catcher.name = "Catcher"; catcher.is_shadow_catcher = True
    return sc

# ---------- materials ----------
def mat(name, base, metallic=0, rough=.5, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = rgb(base)
    p.inputs["Metallic"].default_value = metallic
    p.inputs["Roughness"].default_value = rough
    for k, v in kw.items():
        if k in p.inputs: p.inputs[k].default_value = v
    return m

def bump(m, scale=40, strength=.15, kind='NOISE'):
    nt = m.node_tree; n = nt.nodes
    tex = n.new('ShaderNodeTexNoise' if kind == 'NOISE' else 'ShaderNodeTexWave'); tex.inputs['Scale'].default_value = scale
    b = n.new('ShaderNodeBump'); b.inputs['Strength'].default_value = strength
    nt.links.new(tex.outputs[0], b.inputs['Height']); nt.links.new(b.outputs['Normal'], n["Principled BSDF"].inputs['Normal'])
    return m

MATS = {}
def mats():
    MATS['gilt']  = bump(mat("Gilt", HEX['brass'], metallic=1, rough=.26), 60, .08)
    MATS['narra'] = bump(mat("Narra", HEX['narra'], rough=.48), 8, .2, 'WAVE')
    MATS['capiz'] = mat("Capiz", HEX['cream'], rough=.32, Transmission=0.85, IOR=1.45, **{"Coat Weight": 0.6})
    MATS['satin'] = mat("Satin", HEX['rosewood'], rough=.34, **{"Sheen Weight": 1.0, "Sheen Tint": rgb("E6C0B3"), "Anisotropic": 0.6})
    MATS['wax']   = bump(mat("Wax", HEX['garnet'], rough=.28, **{"Subsurface Weight": 0.3, "Subsurface Radius": (0.3, 0.1, 0.1)}), 30, .25)
    MATS['petal'] = mat("Petal", HEX['blush'], rough=.6, **{"Subsurface Weight": 0.45, "Subsurface Radius": (0.4, 0.2, 0.2)})
    MATS['petal_g'] = mat("PetalGarnet", HEX['garnet'], rough=.6, **{"Subsurface Weight": 0.35})
    MATS['samp']  = mat("Sampaguita", "FFFFFF", rough=.55, **{"Subsurface Weight": 0.5})
    MATS['leaf']  = mat("Leaf", HEX['olive'], rough=.5, **{"Subsurface Weight": 0.2})
    MATS['ivory'] = mat("Ivory", HEX['marigold'], rough=.45)
    # lace: cream, alpha from a voronoi mesh so light passes through the holes
    lace = mat("Lace", HEX['cream'], rough=.7); nt = lace.node_tree; n = nt.nodes
    v = n.new('ShaderNodeTexVoronoi'); v.inputs['Scale'].default_value = 90
    ramp = n.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].position = .12; ramp.color_ramp.elements[1].position = .2
    nt.links.new(v.outputs['Distance'], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], n["Principled BSDF"].inputs['Alpha'])
    lace.blend_method = 'HASHED'; MATS['lace'] = lace

def assign(o, m):
    o.data.materials.clear(); o.data.materials.append(MATS[m]); return o

# ---------- primitives ----------
def cyl(r, h, loc, m, verts=48, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=loc, rotation=rot)
    return assign(bpy.context.object, m)

def torus(R, r, loc, m, rot=(math.radians(90), 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=64, minor_segments=16)
    return assign(bpy.context.object, m)

def curve_tube(points, r, m, cyclic=False, name="tube"):
    cu = bpy.data.curves.new(name, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 6; cu.use_fill_caps = True
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(points) - 1); sp.use_cyclic_u = cyclic
    for bp, p in zip(sp.bezier_points, points):
        bp.co = Vector(p); bp.handle_left_type = bp.handle_right_type = 'AUTO'
    o = bpy.data.objects.new(name, cu); bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(MATS[m]); return o

def bevel(o, w=.01, segs=3):
    b = o.modifiers.new("Bevel", 'BEVEL'); b.width = w; b.segments = segs; return o

def petal(cx, cy, cz, L, W, yaw, tilt, m):
    """a cupped petal: a subdivided plane bent along its length"""
    bpy.ops.mesh.primitive_plane_add(size=1, location=(cx, cy, cz))
    o = bpy.context.object; o.scale = (W, L, 1)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.subdivide(number_cuts=6); bpy.ops.object.mode_set(mode='OBJECT')
    sd = o.modifiers.new("Bend", 'SIMPLE_DEFORM'); sd.deform_method = 'BEND'; sd.angle = math.radians(110); sd.deform_axis = 'X'
    o.rotation_euler = (math.radians(tilt), 0, math.radians(yaw))
    return assign(o, m)

def rose(cx, cz, r, m="petal", rnd=None):
    """rings of cupped petals closing on a tight heart — reads as a garden rose from the front.
    SHORTFALL: procedural petals have no veins, no torn edges, no colour break at the lip; a scanned
    petal texture (or a photographed rose cut-out) is what closes the gap."""
    rnd = rnd or random.Random(1)
    for (n, off, L, W, tilt) in [(9, .66, .62, .5, 70), (7, .42, .5, .38, 50), (5, .22, .36, .28, 30), (3, .08, .2, .16, 10)]:
        for i in range(n):
            a = 2 * math.pi * i / n + rnd.uniform(-.15, .15)
            petal(cx + math.cos(a) * r * off, -0.02 * off, cz + math.sin(a) * r * off, r * L, r * W, math.degrees(a) + 90, tilt + rnd.uniform(-10, 10), m)

def sampaguita(cx, cz, r):
    for i in range(6):
        a = 2 * math.pi * i / 6
        petal(cx + math.cos(a) * r * .5, -0.05, cz + math.sin(a) * r * .5, r * .9, r * .4, math.degrees(a) + 90, 20, "samp")
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r * .18, location=(cx, -0.08, cz)); assign(bpy.context.object, "ivory")

def leaf(cx, cz, L, W, yaw):
    petal(cx, 0.03, cz, L, W, yaw, 8, "leaf")

# ---------- pieces ----------
def build_column():
    """narra fluted column under a capiz arch window. Flutes = a wave-texture displace on the shaft."""
    sh = cyl(.26, 3.3, (0, 0, -.25), "narra", 96)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.subdivide(number_cuts=20); bpy.ops.object.mode_set(mode='OBJECT')
    tex = bpy.data.textures.new("Flute", 'WOOD'); tex.wood_type = 'BANDS'; tex.noise_scale = .12
    d = sh.modifiers.new("Flutes", 'DISPLACE'); d.texture = tex; d.strength = -.05; d.texture_coords = 'LOCAL'
    bevel(torus(.3, .06, (0, 0, 1.45), "narra"))
    bevel(cyl(.4, .1, (0, 0, 1.56), "narra", 8)).rotation_euler = (0, 0, math.radians(22.5))
    bevel(cyl(.36, .1, (0, 0, -1.95), "narra", 8)).rotation_euler = (0, 0, math.radians(22.5))
    bevel(cyl(.46, .12, (0, 0, -2.06), "narra", 8)).rotation_euler = (0, 0, math.radians(22.5))
    # the capiz arch above: a half-ring of narra and a lattice of thin shell squares, the arch clipped
    pts = [(-.5 * math.cos(t), 0, 1.65 + .5 * math.sin(t)) for t in [math.radians(a) for a in range(0, 181, 15)]]
    bevel(curve_tube(pts, .035, "narra", name="arch"))
    for z in [1.65 + .14 * k for k in range(0, 4)]:
        for x in [-.42 + .14 * k for k in range(0, 7)]:
            if math.hypot(x, z - 1.65) > .47: continue
            bpy.ops.mesh.primitive_plane_add(size=.12, location=(x, 0.02, z), rotation=(math.radians(90), 0, 0)); assign(bpy.context.object, "capiz")
    for x in (-.28, -.14, 0, .14, .28): curve_tube([(x, 0.0, 1.62), (x, 0.0, 2.15)], .01, "narra", name="mullion")
    for z in (1.79, 1.93): curve_tube([(-.5, 0.0, z), (.5, 0.0, z)], .01, "narra", name="mullion")
    # the garland: a helix of leaves and sampaguita, three roses
    rnd = random.Random(23)
    for i in range(16):
        t = i / 16; a = t * math.pi * 2.2; z = 1.3 - t * 3.1; x = math.cos(a) * .3
        leaf(x, z, .28, .1, rnd.uniform(0, 360));
        if i % 3 == 1: sampaguita(x + rnd.uniform(-.06, .06), z, .12)
    rose(.3, .9, .22, "petal", rnd); rose(-.3, -.1, .2, "petal", rnd); rose(.28, -1.2, .18, "petal_g", rnd)

def build_drape():
    """a satin curtain, cloth-simulated: pinned along the rod, a collision cylinder standing in for the tieback
    pulls the waist toward the wall, the skirt falls and pools. Bakes 60 frames, renders frame 60.
    SHORTFALL: cloth needs tuning per run (stiffness/damping); satin reads best with an anisotropic sheen —
    set in MATS['satin']. The sash and sprig are separate small objects added after the bake."""
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0)); o = bpy.context.object; o.name = "Drape"
    o.scale = (1.2, 1, 1); o.rotation_euler = (math.radians(90), 0, 0); o.location = (0, 0, .4)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    o.scale = (1, 1, 6.4); bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.subdivide(number_cuts=70); bpy.ops.object.mode_set(mode='OBJECT')
    vg = o.vertex_groups.new(name="Pin")
    top = [v.index for v in o.data.vertices if v.co.z > 3.1]; vg.add(top, 1.0, 'REPLACE')
    cl = o.modifiers.new("Cloth", 'CLOTH'); cl.settings.vertex_group_mass = "Pin"; cl.settings.quality = 8
    cl.settings.mass = .3; cl.settings.tension_stiffness = 12; cl.settings.bending_stiffness = .4; cl.settings.air_damping = 1.2
    cl.collision_settings.use_self_collision = True
    assign(o, "satin")
    tie = cyl(.35, 1.2, (-1.0, -.3, -.6), "satin", rot=(0, math.radians(90), 0)); tie.name = "Tieback"; tie.hide_render = True
    tie.modifiers.new("Col", 'COLLISION')
    sc = bpy.context.scene; sc.frame_start, sc.frame_end = 1, 60
    bpy.ops.ptcache.bake_all(bake=True); sc.frame_set(60)
    curve_tube([(-.6, -.25, -.55), (0, -.4, -.5), (.5, -.25, -.45)], .08, "petal", name="sash")
    rose(.1, -.5, .2, "petal", random.Random(5)); sampaguita(.4, -.42, .1); leaf(-.2, -.45, .3, .1, 200)

def build_seal():
    """a wax seal: a displaced disc with a pressed inner field left BLANK — the couple's own mark (the shipped
    `mark` element) is composited on the page, so one render serves every couple."""
    bpy.ops.mesh.primitive_circle_add(vertices=96, radius=.78, fill_type='NGON', location=(0, 0, 0), rotation=(math.radians(90), 0, 0))
    o = bpy.context.object
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.extrude_region_move(TRANSFORM_OT_translate={"value": (0, -.12, 0)}); bpy.ops.mesh.subdivide(number_cuts=3); bpy.ops.object.mode_set(mode='OBJECT')
    tex = bpy.data.textures.new("Blob", 'CLOUDS'); tex.noise_scale = .6
    d = o.modifiers.new("Blob", 'DISPLACE'); d.texture = tex; d.strength = .14
    bevel(o, .03, 4); assign(o, "wax")
    bevel(torus(.56, .035, (0, -.13, 0), "wax"))
    inner = cyl(.5, .03, (0, -.12, 0), "wax", 96, rot=(math.radians(90), 0, 0)); bevel(inner, .01)

def build_corner():
    """rose cluster + olive leaves + sampaguita for a card corner; floats on the page."""
    rnd = random.Random(53)
    for a in range(-20, 140, 24): leaf(.1 + math.cos(math.radians(a)) * .5, .1 + math.sin(math.radians(a)) * .5, .62, .2, a - 90)
    rose(-.05, .05, .45, "petal_g", rnd); rose(.5, .35, .3, "petal", rnd); rose(-.3, -.45, .28, "petal", rnd)
    for (x, z) in [(.45, -.1), (.1, .55), (-.5, .2), (.3, -.5)]: sampaguita(x, z, .12)

def build_rsvp():
    """the RSVP garland: a blush satin ribbon band with a central garnet rose, blush and dusty roses either side,
    an olive leaf fan behind, sampaguita sprinkled, vines trailing to both ends."""
    rnd = random.Random(41)
    curve_tube([(-1.55, -.05, -.25), (-.8, -.1, -.4), (0, -.1, -.42), (.8, -.1, -.4), (1.55, -.05, -.25)], .07, "petal", name="ribbon")
    for a in range(-150, 151, 25): leaf(0, 0, .55, .16, a)
    rose(0, 0, .4, "petal_g", rnd); rose(-.58, -.05, .3, "petal", rnd); rose(.58, -.05, .3, "petal", rnd)
    rose(-1.0, -.02, .22, "petal", rnd); rose(1.0, -.02, .22, "petal", rnd)
    for s in (-1, 1):
        pts = [(s * .5, .02, .1), (s * 1.0, .02, .25), (s * 1.4, .02, .05), (s * 1.68, .02, .1)]
        curve_tube(pts, .012, "leaf", name="vine")
        for i in range(6): leaf(s * (.6 + i * .18), .18 - (i % 2) * .2, .26, .09, rnd.uniform(0, 360))
        sampaguita(s * .85, .3, .1); sampaguita(s * 1.3, .22, .1)

def build_oval():
    """gilt oval frame with a lace underlay — the closing's photo sits in the open centre."""
    cu = bpy.data.curves.new("oval", 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = .05; cu.bevel_resolution = 8
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(15); sp.use_cyclic_u = True
    for i, bp in enumerate(sp.bezier_points):
        t = 2 * math.pi * i / 16; bp.co = (1.2 * math.cos(t), 0, 1.6 * math.sin(t)); bp.handle_left_type = bp.handle_right_type = 'AUTO'
    o = bpy.data.objects.new("Oval", cu); bpy.context.scene.collection.objects.link(o); o.data.materials.append(MATS['gilt'])
    for i in range(48):  # gilt beads riding the ring
        t = 2 * math.pi * i / 48
        bpy.ops.mesh.primitive_uv_sphere_add(radius=.045, location=(1.2 * math.cos(t), -.04, 1.6 * math.sin(t))); assign(bpy.context.object, "gilt")
    bpy.ops.mesh.primitive_circle_add(vertices=96, radius=1, fill_type='NGON', location=(0, .08, 0), rotation=(math.radians(90), 0, 0))
    lace = bpy.context.object; lace.scale = (1.42, 1, 1.82); assign(lace, "lace")
    bpy.ops.mesh.primitive_circle_add(vertices=96, radius=1, fill_type='NGON', location=(0, .07, 0), rotation=(math.radians(90), 0, 0))
    hole = bpy.context.object; hole.scale = (1.16, 1, 1.56)
    b = lace.modifiers.new("Hole", 'BOOLEAN'); b.object = hole; b.operation = 'DIFFERENCE'; hole.hide_render = True
    rnd = random.Random(71)
    rose(0, 1.72, .3, "petal_g", rnd); rose(-.45, 1.6, .2, "petal", rnd); rose(.45, 1.6, .2, "petal", rnd); rose(0, -1.7, .22, "petal", rnd)
    for i in range(24):
        t = 2 * math.pi * i / 24; leaf(1.22 * math.cos(t), 1.62 * math.sin(t), .3, .1, math.degrees(t) + rnd.uniform(-40, 40))
        if i % 3 == 0: sampaguita(1.22 * math.cos(t), 1.62 * math.sin(t), .1)

def build_chandelier():
    """brass six-arm candle chandelier for the Program/Details crown; sways by CSS."""
    for (r, h, z) in [(.08, .5, .8), (.16, .12, .5), (.1, .6, .1), (.2, .1, -.25), (.12, .3, -.45), (.06, .25, -.7)]:
        bevel(cyl(r, h, (0, 0, z), "gilt", 32), .01)
    for i in range(6):
        a = 2 * math.pi * i / 6; x, y = math.cos(a), math.sin(a)
        curve_tube([(0, 0, -.2), (x * .35, y * .35, -.5), (x * .7, y * .7, -.35), (x * .78, y * .78, -.05)], .022, "gilt", name="arm")
        bevel(cyl(.09, .03, (x * .78, y * .78, -.04), "gilt", 24), .005)
        cyl(.03, .4, (x * .78, y * .78, .18), "ivory", 16)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=.035, location=(x * .78, y * .78, .42)); fl = bpy.context.object
        m = bpy.data.materials.new("Flame"); m.use_nodes = True; e = m.node_tree.nodes["Principled BSDF"]
        e.inputs["Emission Color"].default_value = (1, .7, .3, 1); e.inputs["Emission Strength"].default_value = 12; fl.data.materials.append(m)

def build_fan():
    """ivory lace fan with a narra guard, half-open; tucks behind a card corner."""
    for i in range(19):
        a = math.radians(10 + i * 160 / 18)
        curve_tube([(0, 0, -.5), (math.cos(a) * 1.45, 0, -.5 + math.sin(a) * 1.45)], .012, "narra", name="stick")
    bpy.ops.mesh.primitive_circle_add(vertices=96, radius=1.5, fill_type='NGON', location=(0, .02, -.5), rotation=(math.radians(90), 0, 0))
    lace = bpy.context.object; assign(lace, "lace")
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, .1, -1.6)); cut = bpy.context.object; cut.scale = (4, 1, 2.2); cut.hide_render = True
    b = lace.modifiers.new("Half", 'BOOLEAN'); b.object = cut; b.operation = 'DIFFERENCE'
    bevel(curve_tube([(0, -.02, -.5), (math.cos(math.radians(10)) * 1.5, -.02, -.5 + math.sin(math.radians(10)) * 1.5)], .03, "narra", name="guard"))
    bevel(cyl(.06, .08, (0, 0, -.5), "gilt", 24, rot=(math.radians(90), 0, 0)))

BUILD = dict(column=build_column, drape=build_drape, seal=build_seal, corner=build_corner, rsvp=build_rsvp,
             oval=build_oval, chandelier=build_chandelier, fan=build_fan)

def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    ap = argparse.ArgumentParser(); ap.add_argument("--piece", default="all"); ap.add_argument("--out", default="render")
    ap.add_argument("--samples", type=int, default=96); ap.add_argument("--no-render", action="store_true")
    a = ap.parse_args(argv)
    os.makedirs(a.out, exist_ok=True)
    for piece in (BUILD if a.piece == "all" else [a.piece]):
        reset(); setup(piece, a.samples); mats(); BUILD[piece]()
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(a.out, f"{piece}.blend"))
        if not a.no_render:
            bpy.context.scene.render.filepath = os.path.join(a.out, f"{piece}.png")
            bpy.ops.render.render(write_still=True)
            print("rendered", piece)

if __name__ == "__main__":
    main()
