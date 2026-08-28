# Appendix — every visible coverage leaf, and the card kind that claims it

> Measured **2026-08-28** out of production (project `njrupjnvkjkitfctetvi`) **by the object**, not
> from a migration or a doc. Companion to
> [`SERVICE_CARD_VOCABULARY_MEASURED_2026-08-28.md`](SERVICE_CARD_VOCABULARY_MEASURED_2026-08-28.md).
>
> **Visible** = exactly what `getCoverageTaxonomy()` renders to a supplier: a leaf that is not
> `marketplace_hidden`, sitting on a tier-2 tile that is neither retired nor hidden, whose tier-1
> folder is likewise live. **262 leaves · 73 tiles · 16 folders.**
> (288 leaf rows exist; 25 are `marketplace_hidden` and 1 more is orphaned by a hidden tile.)
>
> **Verdict column**
>
> | | meaning | count |
> |---|---|---|
> | **EXACT** | the leaf key *is* one of the 52 card-kind keys | **16** |
> | **FAMILY** | no leaf-level equivalent — a card kind claims the leaf's TILE. This is the bridge the maker uses today, and it is correct; it is not the two lists agreeing | **195** |
> | **NONE** | no card kind **means this trade**. ⚠ The shop can still make a card — `misc` (*Miscellaneous*) is on the same screen for everybody and is exempt from the family cap — it just has no honest word to file it under (owner's correction 2026-08-28: *"the card is universal fit for any service"*) | **51** |
>
> The 51 NONE leaves sit across **19 tiles that hold leaves** (plus 2 empty orphan tiles, `editorial`
> and `filipiniana_barongs`). Loudest of them: **Food Cart (8 leaves) · Outdoor (9) · Women's Attire
> (6) · Men's Attire (5) · Mocktail (3) · Digital Services (3)**.

| Folder | Branch (tile) | Leaf a supplier picks | Leaf key | Verdict | Card kind(s) that claim it |
|---|---|---|---|---|---|
| Attire, hair & make-up | Bride's Attire | Bridal gown (custom) | bridal_gown_custom | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Bridal Gown (Rental) | bridal_gown_rental | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Filipiniana Balintawak | filipiniana_balintawak | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Filipiniana Maria Clara | filipiniana_maria_clara | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Filipiniana Terno | filipiniana_terno | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Maranao Wedding Attire (malong-inspired) | maranao_wedding_attire | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Modest INC Bridal Attire | inc_modest_bridal | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Modest Muslim Bridal Attire | muslim_modest_bridal | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Qipao / Cheongsam Bridal | qipao_cheongsam_attire | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Sari / Lehenga Bridal | sari_lehenga_bridal | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Tausug Wedding Attire (beadwork-heavy) | tausug_wedding_attire | FAMILY | Gown designer |
| Attire, hair & make-up | Bride's Attire | Yakan Textile Bridal | yakan_wedding_attire | FAMILY | Gown designer |
| Attire, hair & make-up | Groom's Attire | Barong Tagalog (Custom) | barong_tagalog_custom | FAMILY | Suit designer |
| Attire, hair & make-up | Groom's Attire | Barong Tagalog (Rental) | barong_tagalog_rental | FAMILY | Suit designer |
| Attire, hair & make-up | Groom's Attire | Maranao Groom Attire (malong/okir) | maranao_groom_attire | FAMILY | Suit designer |
| Attire, hair & make-up | Groom's Attire | Modest Muslim Groom Attire | muslim_groom_attire | FAMILY | Suit designer |
| Attire, hair & make-up | Groom's Attire | Sherwani / Groom Attire | sherwani_groom | FAMILY | Suit designer |
| Attire, hair & make-up | Groom's Attire | Tausug Groom Attire (beadwork) | tausug_groom_attire | FAMILY | Suit designer |
| Attire, hair & make-up | Groom's Attire | Wedding Suits / Tuxedos (Custom) | groom_suit_custom | FAMILY | Suit designer |
| Attire, hair & make-up | Groom's Attire | Wedding Suits / Tuxedos (Rental) | groom_suit_rental | FAMILY | Suit designer |
| Attire, hair & make-up | Groom's Attire | Yakan Textile Groom Attire | yakan_groom_attire | FAMILY | Suit designer |
| Attire, hair & make-up | Grooming | Groom Grooming (skincare, beard, hair) | groom_grooming | NONE | (none) |
| Attire, hair & make-up | HMUA | Bridal Hair Stylists | bridal_hair_stylist | FAMILY | Hair stylist / Makeup artist |
| Attire, hair & make-up | HMUA | Bridal Makeup Artists | bridal_hmua | FAMILY | Hair stylist / Makeup artist |
| Attire, hair & make-up | HMUA | Family Makeup Artists | family_mua | FAMILY | Hair stylist / Makeup artist |
| Attire, hair & make-up | HMUA | Maternity Bride MUA | maternity_bride_mua | FAMILY | Hair stylist / Makeup artist |
| Attire, hair & make-up | HMUA | Mature Bride MUA | mature_bride_mua | FAMILY | Hair stylist / Makeup artist |
| Attire, hair & make-up | HMUA | Touch-Up Artists (day-of) | touchup_mua | FAMILY | Hair stylist / Makeup artist |
| Attire, hair & make-up | Jewelleries & Accessories | Bridal Headpieces | bridal_headpiece | FAMILY | Rings |
| Attire, hair & make-up | Jewelleries & Accessories | Bridal Jewellery | bridal_jewellery | FAMILY | Rings |
| Attire, hair & make-up | Jewelleries & Accessories | Bridal Jewellery (Rental) | bridal_jewellery_rental | FAMILY | Rings |
| Attire, hair & make-up | Jewelleries & Accessories | Engagement Rings | engagement_ring | FAMILY | Rings |
| Attire, hair & make-up | Jewelleries & Accessories | Floral Jewellery | floral_jewellery | FAMILY | Rings |
| Attire, hair & make-up | Jewelleries & Accessories | Flower Girl Tiaras | flower_girl_tiara | FAMILY | Rings |
| Attire, hair & make-up | Jewelleries & Accessories | Garters | wedding_garter | FAMILY | Rings |
| Attire, hair & make-up | Jewelleries & Accessories | Sponsor Corsages | sponsor_corsage | FAMILY | Rings |
| Attire, hair & make-up | Jewelleries & Accessories | Wedding Bands | wedding_ring | FAMILY | Rings |
| Attire, hair & make-up | Jewelleries & Accessories | Wedding Veils & Trains | wedding_veil | FAMILY | Rings |
| Attire, hair & make-up | Men's Attire | 18 Roses / Escort Attire | eighteen_roses_attire | NONE | (none) |
| Attire, hair & make-up | Men's Attire | Groomsman Sets (matched) | groomsman_set | NONE | (none) |
| Attire, hair & make-up | Men's Attire | Junior Groomsman | junior_groomsman | NONE | (none) |
| Attire, hair & make-up | Men's Attire | Ring Bearer Suits | ring_bearer_suit | NONE | (none) |
| Attire, hair & make-up | Men's Attire | Sponsor Attire - Ninong Sets | ninong_attire | NONE | (none) |
| Attire, hair & make-up | Wellness & Fitness | Bridal Dental (whitening/alignment) | bridal_dental | FAMILY | Wellness & fitness |
| Attire, hair & make-up | Wellness & Fitness | Bridal Dermatology (skin prep) | bridal_dermatology | FAMILY | Wellness & fitness |
| Attire, hair & make-up | Wellness & Fitness | Bridal Fitness Programs (pre-wedding) | bridal_fitness | FAMILY | Wellness & fitness |
| Attire, hair & make-up | Wellness & Fitness | Bridal Nutritionist / Diet Coach | bridal_nutritionist | FAMILY | Wellness & fitness |
| Attire, hair & make-up | Wellness & Fitness | Bridal Spa & Wellness | bridal_spa | FAMILY | Wellness & fitness |
| Attire, hair & make-up | Women's Attire | Bridesmaid Dresses | bridesmaid_dress | NONE | (none) |
| Attire, hair & make-up | Women's Attire | Debutante Ball Gown | debutante_gown | NONE | (none) |
| Attire, hair & make-up | Women's Attire | Flower Girl Dresses | flower_girl_dress | NONE | (none) |
| Attire, hair & make-up | Women's Attire | Junior Bridesmaid Dresses | junior_bridesmaid_dress | NONE | (none) |
| Attire, hair & make-up | Women's Attire | Mother-of-Bride Gowns | mother_of_bride_gown | NONE | (none) |
| Attire, hair & make-up | Women's Attire | Sponsor Attire - Ninang Sets | ninang_attire | NONE | (none) |
| Booths, carts & bars | Arcade / Games | Arcade / Retro Games | arcade_retro_games | FAMILY | Guest booths & activities |
| Booths, carts & bars | Arcade / Games | VR / AR Experience Station | vr_ar_station | FAMILY | Guest booths & activities |
| Booths, carts & bars | Caricature / Calligraphy / Painting | Caricature Artist | caricature_artist | FAMILY | Guest booths & activities |
| Booths, carts & bars | Caricature / Calligraphy / Painting | Live Calligraphy / Name Printing | live_calligraphy | FAMILY | Guest booths & activities |
| Booths, carts & bars | Caricature / Calligraphy / Painting | Live Poetry Typewriter | poetry_typewriter | FAMILY | Guest booths & activities |
| Booths, carts & bars | Caricature / Calligraphy / Painting | Live Wedding-Portrait Painter | wedding_portrait_painter | FAMILY | Guest booths & activities |
| Booths, carts & bars | Caricature / Calligraphy / Painting | Silhouette / Profile Artist | silhouette_artist | FAMILY | Guest booths & activities |
| Booths, carts & bars | Coffee / Espresso | Coffee booth | coffee_booth | NONE | (none) |
| Booths, carts & bars | Coffee / Espresso | Tea Ceremony / Tea Bar | tea_bar | NONE | (none) |
| Booths, carts & bars | Dessert | Dessert Stations | dessert_station | NONE | (none) |
| Booths, carts & bars | Dessert | Donut Wall / Display | donut_wall_display | NONE | (none) |
| Booths, carts & bars | Engraving / Embroidery | Custom Keychain / Magnet Engraving | keychain_engraving | NONE | (none) |
| Booths, carts & bars | Engraving / Embroidery | Live Embroidery (on handkerchiefs) | live_embroidery | NONE | (none) |
| Booths, carts & bars | Food Cart | Cheese / Charcuterie Board | charcuterie_board | NONE | (none) |
| Booths, carts & bars | Food Cart | Cotton Candy Cart | cotton_candy_cart | NONE | (none) |
| Booths, carts & bars | Food Cart | Crepe / Pancake Station | crepe_pancake_station | NONE | (none) |
| Booths, carts & bars | Food Cart | Food Cart (Generic) | food_cart_generic | NONE | (none) |
| Booths, carts & bars | Food Cart | Halo-Halo Station | halo_halo_station | NONE | (none) |
| Booths, carts & bars | Food Cart | Ice Cream Cart | ice_cream_cart | NONE | (none) |
| Booths, carts & bars | Food Cart | Mini Lechon Station | mini_lechon_station | NONE | (none) |
| Booths, carts & bars | Food Cart | Sorbetes Cart | sorbetes_cart | NONE | (none) |
| Booths, carts & bars | Food Truck | Food Trucks | food_truck | NONE | (none) |
| Booths, carts & bars | Henna / Tattoo | Henna / Temporary Tattoo Booth | henna_tattoo_booth | FAMILY | Guest booths & activities |
| Booths, carts & bars | Henna / Tattoo | Mehndi Artist (bridal henna) | mehndi_artist | FAMILY | Guest booths & activities |
| Booths, carts & bars | Henna / Tattoo | Muslim Henna Artist (cultural style) | muslim_henna_artist | FAMILY | Guest booths & activities |
| Booths, carts & bars | Massage Chair | Aromatherapy Station | aromatherapy_station | FAMILY | Guest booths & activities |
| Booths, carts & bars | Massage Chair | Hair Touch-Up Station | hair_touchup_station | FAMILY | Guest booths & activities |
| Booths, carts & bars | Massage Chair | Massage Chair Station | massage_chair_station | FAMILY | Guest booths & activities |
| Booths, carts & bars | Mini Nail Bar | Mini Nail Bar | mini_nail_bar | FAMILY | Guest booths & activities |
| Booths, carts & bars | Mobile Bar | Mobile bar | mobile_bar | EXACT | Mobile bar |
| Booths, carts & bars | Mobile Bar | Wine / Whiskey / Cigar Bar | whiskey_cigar_bar | FAMILY | Mobile bar |
| Booths, carts & bars | Mocktail | Mocktail Bar (alcohol-free) | mocktail_bar | NONE | (none) |
| Booths, carts & bars | Mocktail | Mocktail Bar (booth-scale) | mocktail_booth_mini | NONE | (none) |
| Booths, carts & bars | Mocktail | Mocktail-Only Caterers | mocktail_only_caterer | NONE | (none) |
| Booths, carts & bars | Perfume Bar | Perfume Bar (custom blend) | perfume_bar | FAMILY | Guest booths & activities |
| Booths, carts & bars | Photo Booth | 360 Booth | booth_360 | FAMILY | Photobooth |
| Booths, carts & bars | Photo Booth | GIF Booth | gif_booth | FAMILY | Photobooth |
| Booths, carts & bars | Photo Booth | Pabati | pabati | FAMILY | Photobooth |
| Booths, carts & bars | Photo Booth | Photo booth | photo_booth | FAMILY | Photobooth |
| Booths, carts & bars | Photo Booth | Polaroid / Instax Booth | polaroid_booth | FAMILY | Photobooth |
| Booths, carts & bars | Photo Booth | Selfie Magic Mirror | selfie_magic_mirror | FAMILY | Photobooth |
| Booths, carts & bars | Photo Booth | Setnayan Patiktok (TikTok Booth) | setnayan_patiktok | FAMILY | Photobooth |
| Booths, carts & bars | Tarot / Astrology / Palmistry | Palmistry Reader | palmistry_reader | FAMILY | Guest booths & activities |
| Booths, carts & bars | Tarot / Astrology / Palmistry | Tarot / Astrology Reading | tarot_astrology | FAMILY | Guest booths & activities |
| Cars & transport | Bridal Car | Bridal Boat / Yacht (destination weddings) | bridal_boat_yacht | FAMILY | Transportation |
| Cars & transport | Bridal Car | Horse-Drawn Carriage | horse_drawn_carriage | FAMILY | Transportation |
| Cars & transport | Bridal Car | Transportation - bridal car | transportation_bridal_car | FAMILY | Transportation |
| Cars & transport | Bridal Car | Vintage / Classic Vehicle Rental | vintage_classic_vehicle | FAMILY | Transportation |
| Cars & transport | Escort | Motorcycle Escort | motorcycle_escort | NONE | (none) |
| Cars & transport | Guest Shuttle | Guest Shuttle Service | transportation_guest_shuttle | FAMILY | Transportation |
| Cars & transport | Transfers & Rentals | Airport Transfer | airport_transfer | FAMILY | Transportation |
| Cars & transport | Transfers & Rentals | Boat / Ferry Charter | boat_ferry_charter | FAMILY | Transportation |
| Cars & transport | Transfers & Rentals | Motorcycle / Scooter Rental | motorcycle_scooter_rental | FAMILY | Transportation |
| Cars & transport | Transfers & Rentals | Private Car Charter | private_car_charter | FAMILY | Transportation |
| Cars & transport | Transfers & Rentals | Van Rental | van_rental | FAMILY | Transportation |
| Catering & cake | Cake | Wedding cake | wedding_cake | FAMILY | Cake maker |
| Catering & cake | Catering | Catering | catering | EXACT | Catering |
| Catering & cake | Catering | Halal Catering Specialists | halal_catering | FAMILY | Catering |
| Catering & cake | Catering | Lauriat / Chinese Banquet Caterer | chinese_lauriat_caterer | FAMILY | Catering |
| Catering & cake | Catering | Lechonero (whole-pig roast specialist) | lechonero | FAMILY | Catering |
| Catering & cake | Crew Meals | Crew Meal Supply | crew_meal_supply | FAMILY | Crew Meals |
| Catering & cake | Stations | Live Cooking Stations | live_cooking_station | NONE | (none) |
| Coordinators & planners | Coordinator / Planner | Day-Of Coordinators | day_of_coordinator | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | Despedida Planners | despedida_planner | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | Destination Wedding Specialists | destination_wedding_specialist | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | Gender-Separated Reception Coordinators | gender_separated_reception_coordinator | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | INC-Compatible Wedding Coordinators | inc_wedding_coordinator | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | Mahr Coordination Service | mahr_coordination | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | Pamamanhikan Coordinators | pamamanhikan_coordinator | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | Setnayan Concierge | setnayan_concierge | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | Sponsor Coordinators (ninong/ninang) | sponsor_coordinator | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | Tabernakulo / Mosque Coordinators | religious_venue_coordinator | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | Wedding coordination | wedding_coordination | FAMILY | Planner / Coordinator |
| Coordinators & planners | Coordinator / Planner | Wedding Planners (Partial / Month-of) | wedding_planner_partial | FAMILY | Planner / Coordinator |
| Coordinators & planners | Date & Feng-shui Specialist | Chinese Date & Feng-shui Consultant | date_fengshui_consultant | NONE | (none) |
| Coordinators & planners | Paperwork & Government | Apostille / DFA Authentication Services | apostille_dfa_authentication | FAMILY | Paperwork & Government |
| Coordinators & planners | Paperwork & Government | Marriage License Expediting Service | marriage_license_expediting | FAMILY | Paperwork & Government |
| Coordinators & planners | Paperwork & Government | Visa-Wedding Logistics (Fil-Am couples) | visa_wedding_logistics | FAMILY | Paperwork & Government |
| Coordinators & planners | Travel & Honeymoon | Destination Wedding Travel Coordinators | destination_wedding_travel_coordinator | FAMILY | Travel & Honeymoon |
| Coordinators & planners | Travel & Honeymoon | Honeymoon Planners | honeymoon_planner | FAMILY | Travel & Honeymoon |
| Dining extras | Restaurant (Reservation) | Restaurant (Reservation) | restaurant_reservation | EXACT | Restaurant (reservation) |
| Funeral homes & farewell | Cremation | Columbarium Niche | columbarium_niche | FAMILY | Cremation |
| Funeral homes & farewell | Cremation | Cremation Service | cremation_service | FAMILY | Cremation |
| Funeral homes & farewell | Funeral Home | Body Repatriation | body_repatriation | FAMILY | Funeral Home |
| Funeral homes & farewell | Funeral Home | Casket | casket | FAMILY | Funeral Home |
| Funeral homes & farewell | Funeral Home | Embalming Preparation | embalming_preparation | FAMILY | Funeral Home |
| Funeral homes & farewell | Funeral Home | Funeral Chapel | funeral_chapel | FAMILY | Funeral Home |
| Funeral homes & farewell | Funeral Home | Hearse Funeral Transport | hearse_funeral_transport | FAMILY | Funeral Home |
| Funeral homes & farewell | Funeral Home | Urn | urn | FAMILY | Funeral Home |
| Funeral homes & farewell | Funeral Home | Wake Package | wake_package | FAMILY | Funeral Home |
| Funeral homes & farewell | Memorial Park | Interment Service | interment_service | FAMILY | Memorial Park |
| Funeral homes & farewell | Memorial Park | Mausoleum | mausoleum | FAMILY | Memorial Park |
| Funeral homes & farewell | Memorial Park | Memorial Lot | memorial_lot | FAMILY | Memorial Park |
| Guest experiences | Tour Guide | Tour Guide | tour_guide | EXACT | Tour guide |
| Guest experiences | Tours & Activities | Tours & Activities | tour_activity | EXACT | Tours & activities |
| Hosts, music & program | AV / Production | AV / Production | av_production | EXACT | AV / Production |
| Hosts, music & program | Choir | Choirs / String Quartets | choir_string_quartet | FAMILY | Choir / String quartet |
| Hosts, music & program | Choreographer | Entourage Choreographer | entourage_choreographer | FAMILY | Choreographer |
| Hosts, music & program | Choreographer | First Dance Choreographer | first_dance_choreographer | FAMILY | Choreographer |
| Hosts, music & program | Choreographer | Pre-Cana Dance Trainer | pre_cana_dance_trainer | FAMILY | Choreographer |
| Hosts, music & program | DJ | DJs | dj | FAMILY | Band / DJ |
| Hosts, music & program | Host / MC | Chinese Tea Ceremony Master | tea_ceremony_master | FAMILY | Host / Emcee |
| Hosts, music & program | Host / MC | Host / emcee | host_emcee | EXACT | Host / Emcee |
| Hosts, music & program | Kids' Entertainer | Kids' Entertainer | kids_entertainer | EXACT | Kids' entertainer |
| Hosts, music & program | Live Band | Band / live music | band_live_music | FAMILY | Band / DJ |
| Hosts, music & program | Live Band | Wedding Bands (full ensemble) | live_band | FAMILY | Band / DJ |
| Hosts, music & program | Orchestra | Orchestra | orchestra | NONE | (none) |
| Hosts, music & program | Performers | Acoustic Performers (solo/duo) | acoustic_performer | FAMILY | Performers (live acts) |
| Hosts, music & program | Performers | Folk Performers | folk_performer | FAMILY | Performers (live acts) |
| Hosts, music & program | Performers | Kulintang Ensembles | kulintang_ensemble | FAMILY | Performers (live acts) |
| Hosts, music & program | Performers | Lion & Dragon Dance | lion_dance_troupe | FAMILY | Performers (live acts) |
| Hosts, music & program | Performers | Rondalla Ensembles | rondalla_ensemble | FAMILY | Performers (live acts) |
| Hosts, music & program | Performers | Wedding Entertainment (magicians, fire dancers, etc.) | wedding_entertainment | FAMILY | Performers (live acts) |
| Hosts, music & program | Speakers / Talent | Speakers / Talent | speaker_talent | EXACT | Speakers / Talent |
| Hosts, music & program | Wedding Singer | Wedding Singers (solo vocalists) | wedding_singer | NONE | (none) |
| Insurance & protection | Event Insurance | Event Insurance | event_insurance | EXACT | Event insurance |
| Insurance & protection | Personal Accident | Personal Accident Insurance | personal_accident_insurance | EXACT | Personal accident insurance |
| Insurance & protection | Travel Insurance | Travel Insurance | travel_insurance | EXACT | Travel insurance |
| Invites, prints & souvenirs | Printing | Ceremony Programs (printed books) | ceremony_program | FAMILY | Invitations & stationery |
| Invites, prints & souvenirs | Printing | Menu Cards | menu_card | FAMILY | Invitations & stationery |
| Invites, prints & souvenirs | Printing | Place Cards | place_card | FAMILY | Invitations & stationery |
| Invites, prints & souvenirs | Printing | Save-the-Date (Digital) | save_the_date_digital | FAMILY | Invitations & stationery |
| Invites, prints & souvenirs | Printing | Signage | stationery_signage | FAMILY | Invitations & stationery |
| Invites, prints & souvenirs | Printing | Wedding Cards Designer (specialty) | wedding_cards_designer | FAMILY | Invitations & stationery |
| Invites, prints & souvenirs | Printing | Wedding Invitations (Digital) | invitation_digital | FAMILY | Invitations & stationery |
| Invites, prints & souvenirs | Printing | Wedding Invitations (Print) | invitation_print | FAMILY | Invitations & stationery |
| Invites, prints & souvenirs | Souvenir / Giveaways | Ang Pao & Betrothal Gifts | angpao_betrothal_supplier | FAMILY | Gifts & giveaways |
| Invites, prints & souvenirs | Souvenir / Giveaways | Inaanak / Godchild Tokens | godchild_token | FAMILY | Gifts & giveaways |
| Invites, prints & souvenirs | Souvenir / Giveaways | Souvenirs / Giveaways | souvenirs_giveaways | FAMILY | Gifts & giveaways |
| Invites, prints & souvenirs | Souvenir / Giveaways | Sponsor Tokens | sponsor_token | FAMILY | Gifts & giveaways |
| Invites, prints & souvenirs | Souvenir / Giveaways | Trousseau / Pasalubong Boxes | pasalubong_box | FAMILY | Gifts & giveaways |
| Invites, prints & souvenirs | Trophies & Awards | Medals & Plaques | medals_plaques | NONE | (none) |
| Invites, prints & souvenirs | Trophies & Awards | Trophies & Awards Supplier | trophy_supplier | NONE | (none) |
| Logistics & safety | Medic / First-aid | Medic / First-aid | event_medic | EXACT | Medic / First-aid |
| Logistics & safety | Referees / Officials | Referees / Officials | referee_official | EXACT | Referees / Officials |
| Photo & video | Photo & Video | Boudoir Photographer | boudoir_photographer | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Drone Operator | drone | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Drone Videographer | drone_videographer | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Engagement Photographer | engagement_photographer | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Family Day-2 / Brunch Photographer | family_day2_photographer | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Highlight Reel Specialist | highlight_reel_specialist | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Photography | photography | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Pre-Nup Photographer | pre_nup_photographer | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Pre-Nup Shoot Locations | pre_nup_shoot_locations | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Same-Day Edit Specialist | same_day_edit | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Setnayan AI Edited Highlight | setnayan_ai_edited_highlight | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Setnayan Papic | setnayan_papic | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Setnayan Save-the-Date Video MP4 | setnayan_save_the_date_mp4 | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Studio Portrait Photographer | studio_portrait_photographer | FAMILY | Photographer / Videographer |
| Photo & video | Photo & Video | Videography | videography | FAMILY | Photographer / Videographer |
| Specialty | Reveal Element | Reveal Element | reveal_element | EXACT | Reveal element |
| Styling, flowers & lights | Dance Floor | LED Dance Floor | led_dance_floor | NONE | (none) |
| Styling, flowers & lights | Digital Services | Setnayan Custom Monogram | setnayan_custom_monogram | NONE | (none) |
| Styling, flowers & lights | Digital Services | Setnayan Pailaw (LED Background) | setnayan_pailaw | NONE | (none) |
| Styling, flowers & lights | Digital Services | Setnayan Pakanta (Custom Song) | setnayan_pakanta | NONE | (none) |
| Styling, flowers & lights | Fireworks | Fireworks & Pyrotechnics | fireworks_pyro | NONE | (none) |
| Styling, flowers & lights | Florist | Beach Wedding Florist | beach_wedding_florist | FAMILY | Florist |
| Styling, flowers & lights | Florist | Bridal Bouquets (specialty separate from florals) | bridal_bouquet_specialty | FAMILY | Florist |
| Styling, flowers & lights | Florist | Florals | florals | FAMILY | Florist |
| Styling, flowers & lights | Florist | Garden Wedding Florist | garden_wedding_florist | FAMILY | Florist |
| Styling, flowers & lights | LED Wall | LED Video Wall | led_video_wall | FAMILY | LED screens |
| Styling, flowers & lights | Lights & Sound | Lights & Sound (banquet) | lights_sound | FAMILY | Lights & sound |
| Styling, flowers & lights | Outdoor | Bug / Mosquito Repellent Stations | bug_repellent_station | NONE | (none) |
| Styling, flowers & lights | Outdoor | Cooling Fans / Misters Rental | cooling_fans_misters | NONE | (none) |
| Styling, flowers & lights | Outdoor | Generator Rental | generator_rental | NONE | (none) |
| Styling, flowers & lights | Outdoor | Mobile Restroom Rental | mobile_restroom_rental | NONE | (none) |
| Styling, flowers & lights | Outdoor | Outdoor Lighting Specialist (string / market lights) | outdoor_lighting_specialist | NONE | (none) |
| Styling, flowers & lights | Outdoor | Outdoor Sound System Specialist | outdoor_sound_system | NONE | (none) |
| Styling, flowers & lights | Outdoor | Parasol / Hat Rental Stations | parasol_hat_rental | NONE | (none) |
| Styling, flowers & lights | Outdoor | Tent / Outdoor-Cover Rental | tent_rental | NONE | (none) |
| Styling, flowers & lights | Outdoor | Wedding-Day Weather Forecaster (Tagaytay-specialty) | wedding_day_weather_forecaster | NONE | (none) |
| Styling, flowers & lights | Stylist / Decorator | Capiz / Native Decor Specialists | capiz_native_decor | FAMILY | Reception decor |
| Styling, flowers & lights | Stylist / Decorator | Chuppah Rental & Styling | chuppah_rental | FAMILY | Reception decor |
| Styling, flowers & lights | Stylist / Decorator | Decorators (general) | decorator_general | FAMILY | Reception decor |
| Styling, flowers & lights | Stylist / Decorator | Double Happiness Decor | double_happiness_decor | FAMILY | Reception decor |
| Styling, flowers & lights | Stylist / Decorator | Hacienda / Heritage Decor | hacienda_heritage_decor | FAMILY | Reception decor |
| Styling, flowers & lights | Stylist / Decorator | Mandap Design & Decor | mandap_decor | FAMILY | Reception decor |
| Styling, flowers & lights | Stylist / Decorator | Maranao Okir Decor Specialists | maranao_okir_decor | FAMILY | Reception decor |
| Styling, flowers & lights | Stylist / Decorator | Stylist / decorator | stylist_decorator | FAMILY | Reception decor |
| Styling, flowers & lights | Stylist / Decorator | Tea Ceremony Set & Styling | tea_set_styling | FAMILY | Reception decor |
| Venues & churches | Accommodation | Accommodation | accommodation | EXACT | Accommodation |
| Venues & churches | Accommodation | Guesthouse / Homestay | guesthouse_homestay | FAMILY | Accommodation |
| Venues & churches | Accommodation | Hotel | hotel_stay | FAMILY | Accommodation |
| Venues & churches | Accommodation | Resort | resort_stay | FAMILY | Accommodation |
| Venues & churches | Accommodation | Vacation Rental | vacation_rental | FAMILY | Accommodation |
| Venues & churches | Ceremony | Aglipayan Church (IFI) | aglipayan_church_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Born Again Church | born_again_church_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Buddhist Temple | buddhist_temple_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Catholic Church / Chapel | catholic_church_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Ceremony Venue | ceremony_venue_booking | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Christian Church | christian_church_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Civil Ceremony Venue | civil_ceremony_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Cultural / Ancestral Ceremony Site | cultural_ceremony_site | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Gurdwara | gurdwara_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Hindu Temple / Mandir | hindu_temple_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Iglesia ni Cristo Kapilya | inc_kapilya_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Kingdom Hall | kingdom_hall_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | LDS Temple / Meetinghouse | lds_temple_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Mosque | mosque_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Orthodox Church | orthodox_church_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Seventh-day Adventist Church | sda_church_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Ceremony | Synagogue | synagogue_venue | FAMILY | Religious Ceremony Venue |
| Venues & churches | Reception | Events Place | events_place | FAMILY | Venue |
| Venues & churches | Reception | Function Hall | function_hall | FAMILY | Venue |
| Venues & churches | Reception | Garden Reception Venue | garden_reception_venue | FAMILY | Venue |
| Venues & churches | Reception | Hotel Ballroom | hotel_ballroom | FAMILY | Venue |
| Venues & churches | Reception | Reception Venue | reception_venue | FAMILY | Venue |
| Venues & churches | Reception | Resort Reception Venue | resort_reception_venue | FAMILY | Venue |
