/**
 * The Fur Studio - Curated Furniture & Workshop Data
 * Handcrafted by Theng Seyha
 */

export const CATEGORIES = [
  {
    "id": "living",
    "name": "Living Room",
    "itemCount": 4,
    "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "description": "Deep lounge seats, sculpted walnut coffee tables, and tactile linen couches."
  },
  {
    "id": "dining",
    "name": "Dining Room",
    "itemCount": 4,
    "image": "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80",
    "description": "Solid white oak communal tables and ergonomic curved-back spindle chairs."
  },
  {
    "id": "bedroom",
    "name": "Bedroom",
    "itemCount": 2,
    "image": "https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=800&q=80",
    "description": "Low-profile platform timber beds and quiet bedside floating ledges."
  },
  {
    "id": "office",
    "name": "Office",
    "itemCount": 2,
    "image": "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80",
    "description": "Focus-forward writing bureaus with hidden cable raceways and solid joinery."
  },
  {
    "id": "storage",
    "name": "Storage",
    "itemCount": 2,
    "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    "description": "Hand-fluted tambour credenzas, slatted sideboards, and modular shelving units."
  },
  {
    "id": "lighting",
    "name": "Lighting",
    "itemCount": 2,
    "image": "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80",
    "description": "Spun brass floor lamps, paper lanterns, and warm dimmable illumination."
  }
];

const RAW_BASE_PRODUCTS = [
  {
    "id": "fur-kanso-sofa-1",
    "name": "Kanso Modular Three-Seater",
    "category": "Living Room",
    "itemType": "sofa",
    "price": 890,
    "originalPrice": 1050,
    "rating": 4.9,
    "reviewCount": 48,
    "badge": "Best Seller",
    "material": "FSC Kiln-Dried Solid Oak & High-Density Belgian Bouclé",
    "dimensions": "W 224cm × D 92cm × H 74cm (Seat Height 42cm)",
    "finish": "Natural Matte Plant-Based Hardwax",
    "leadTime": "24–48 Hours in Phnom Penh",
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Oatmeal Bouclé",
        "hex": "#E6E0D4",
        "inStock": true
      },
      {
        "name": "Warm Charcoal",
        "hex": "#2C2A29",
        "inStock": true
      },
      {
        "name": "Forest Moss",
        "hex": "#3B443B",
        "inStock": true
      }
    ],
    "description": "Engineered around deliberate low horizontal lines, the Kanso Sofa anchors open-plan rooms. Deep feather-down alternative cushions rest on an exposed solid white oak plinth with mortise-and-tenon joints.",
    "features": [
      "Removable, machine-washable commercial-grade bouclé slipcovers",
      "Solid kiln-dried Appalachian white oak perimeter foundation",
      "Reinforced high-resilience foam core with hypoallergenic cloud topper",
      "Anti-sag European steel serpentine suspension springs"
    ]
  },
  {
    "id": "fur-nordic-armchair-1",
    "name": "Soren Low Armchair",
    "category": "Living Room",
    "itemType": "chair",
    "price": 340,
    "originalPrice": 395,
    "rating": 4.8,
    "reviewCount": 34,
    "badge": "Studio Favorite",
    "material": "Solid American Walnut & Top-Grain Aniline Leather",
    "dimensions": "W 76cm × D 82cm × H 78cm",
    "finish": "Hand-Rubbed Organic Linseed Oil",
    "leadTime": "In Stock (Immediate Dispatch)",
    "image": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Cognac Saddle",
        "hex": "#8B4513",
        "inStock": true
      },
      {
        "name": "Pitch Black",
        "hex": "#1C1917",
        "inStock": true
      },
      {
        "name": "Sand Taupe",
        "hex": "#D7C4B7",
        "inStock": false
      }
    ],
    "description": "An ergonomic study in sculpted timber. Continuous steam-bent armrests flow seamlessly into tapered rear legs, supporting a cantilevered seat pan tuned for hours of comfortable reading.",
    "features": [
      "Hand-carved ergonomic paddle armrests for wrist rest",
      "Vegetable-tanned full-grain leather that patinas gracefully",
      "Brass hardware accents hidden inside structural jointing",
      "Tested to withstand over 180kg static load"
    ]
  },
  {
    "id": "fur-dining-table-1",
    "name": "Torii 8-Seater Dining Table",
    "category": "Dining Room",
    "itemType": "table",
    "price": 760,
    "originalPrice": 890,
    "rating": 5,
    "reviewCount": 29,
    "badge": "Craftsman Specimen",
    "material": "Solid European White Oak (Full Planks)",
    "dimensions": "L 210cm × W 95cm × H 75cm",
    "finish": "Zero-VOC Water-Based Polyx Shield",
    "leadTime": "3–5 Days Handcrafted Batch",
    "image": "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Natural White Oak",
        "hex": "#D8C3A5",
        "inStock": true
      },
      {
        "name": "Smoked Walnut Finish",
        "hex": "#5C4033",
        "inStock": true
      }
    ],
    "description": "Inspired by traditional Japanese temple entry gates. The Torii Table showcases 40mm thick uninterrupted solid oak staves with butterfly key inserts stabilizing natural timber grain patterns.",
    "features": [
      "40mm heavy slab edge profile with soft bullnose radius",
      "Undermount steel stabilization channels preventing seasonal warping",
      "Recessed trestle legs allowing seating on all 4 sides without knee bumping",
      "Food-safe heat and water resistant matte clear coating"
    ]
  },
  {
    "id": "fur-tambour-credenza-1",
    "name": "Mori Tambour Credenza",
    "category": "Storage",
    "itemType": "storage",
    "price": 680,
    "originalPrice": 790,
    "rating": 4.9,
    "reviewCount": 22,
    "badge": "Signature",
    "material": "Solid Walnut Framing with Flexible Wood Slat Doors",
    "dimensions": "W 180cm × D 45cm × H 68cm",
    "finish": "Satin Hand-Rubbed Wax",
    "leadTime": "In Stock in Daun Penh Showroom",
    "image": "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "American Walnut",
        "hex": "#4A3728",
        "inStock": true
      },
      {
        "name": "Light Ash",
        "hex": "#D6CFC7",
        "inStock": true
      }
    ],
    "description": "Two fluid tambour doors slide gracefully along hidden CNC-milled tracks into concealed wall cavities, revealing dual storage chambers with height-adjustable shelving and cable grommets.",
    "features": [
      "Whisper-quiet sliding tambour slat action",
      "Internal cable pass-throughs for TV, audio receiver, or gaming gear",
      "Solid wood drawer boxes with traditional dovetail joinery",
      "Brass leg caps with built-in height levelling feet"
    ]
  },
  {
    "id": "fur-zenith-bed",
    "name": "Nami Low Platform Bed Frame",
    "category": "Bedroom",
    "itemType": "bed",
    "price": 620,
    "originalPrice": 720,
    "rating": 4.9,
    "reviewCount": 41,
    "badge": "Popular",
    "material": "Solid Kiln-Dried Ash Wood with Woven Paper Cord Headboard",
    "dimensions": "Queen (L 215cm × W 168cm × H 88cm) / King Available",
    "finish": "Bleached Ash Protective Oil",
    "leadTime": "24–48 Hours Dispatch",
    "image": "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Natural Ash",
        "hex": "#DDD2C3",
        "inStock": true
      },
      {
        "name": "Ebony Stained",
        "hex": "#1E1E1E",
        "inStock": true
      }
    ],
    "description": "Designed to foster serene bedroom atmospheres. The floating cantilevered frame makes cleaning underneath effortless while the hand-woven Danish cord headboard provides gentle, breathable back support.",
    "features": [
      "Integrated solid pine flexible slat base (no box spring required)",
      "Hand-woven resilient 3-ply paper cord lattice backrest",
      "Rounded corner joints designed to protect shins from sharp knocks",
      "Zero-squeak interlocking steel center beam structure"
    ]
  },
  {
    "id": "fur-studio-desk",
    "name": "Atelier Solid Oak Writing Desk",
    "category": "Office",
    "itemType": "desk",
    "price": 450,
    "originalPrice": 520,
    "rating": 4.7,
    "reviewCount": 19,
    "badge": "New Release",
    "material": "Selected Quarter-Sawn Oak & Anodized Gunmetal Steel",
    "dimensions": "W 140cm × D 65cm × H 75cm",
    "finish": "Matte Polyurethane Commercial Grade",
    "leadTime": "In Stock",
    "image": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Raw Honey Oak",
        "hex": "#CDB188",
        "inStock": true
      },
      {
        "name": "Dark Roast Walnut",
        "hex": "#4B3621",
        "inStock": true
      }
    ],
    "description": "A dedicated workspace tailored for modern laptop setups and deep focus. Features a recessed rear brass cable channel with magnetic lid and a velvet-lined concealed stationery drawer.",
    "features": [
      "Full-width magnetic rear cable trough fits multi-socket power strips",
      "Concealed soft-close pencil drawer with partitioned timber trays",
      "Double bevelled ergonomic edge reduces forearm pressure during typing",
      "Sturdy architectural trestle supports tested for zero monitor wobble"
    ]
  },
  {
    "id": "fur-lunar-lamp",
    "name": "Wabi Lunar Paper Floor Lamp",
    "category": "Lighting",
    "itemType": "lighting",
    "price": 180,
    "originalPrice": 220,
    "rating": 4.9,
    "reviewCount": 37,
    "badge": "Handmade Shade",
    "material": "Handmade Mulberry Washi Paper & Solid Walnut Tripod",
    "dimensions": "Diameter 45cm × H 145cm",
    "finish": "Untreated Japanese Mulberry Paper",
    "leadTime": "In Stock",
    "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Natural Parchment",
        "hex": "#F4EFE6",
        "inStock": true
      }
    ],
    "description": "Emits a serene, diffused amber glow that softens harsh room angles. The mulberry washi shade is folded by hand over bamboo ribbing and hoisted on three turned walnut legs.",
    "features": [
      "Includes 2700K warm ambient dimmable LED filament bulb",
      "Solid brass foot pedal dimmer switch along fabric braided cord",
      "Authentic mulberry washi paper with delicate natural fiber texture",
      "Folds flat for compact transit and simple assembly"
    ]
  },
  {
    "id": "fur-kyoto-stool",
    "name": "Kyoto Curved Bench & Stool",
    "category": "Dining Room",
    "itemType": "chair",
    "price": 210,
    "originalPrice": 260,
    "rating": 4.8,
    "reviewCount": 26,
    "badge": "Compact Living",
    "material": "Solid White Oak with Saddle Dish Carve",
    "dimensions": "W 110cm × D 38cm × H 45cm",
    "finish": "Organic Linseed Oil & Beeswax",
    "leadTime": "In Stock",
    "image": "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Natural Oak",
        "hex": "#D2B48C",
        "inStock": true
      },
      {
        "name": "Soot Black",
        "hex": "#1C1A18",
        "inStock": true
      }
    ],
    "description": "Multi-functional bench ideal for entryway shoe changes, dining table seating, or as a bedroom footboard bench. Features hand-planed concave seating contour for ergonomic comfort.",
    "features": [
      "Saddle-carved seat pan dispels pressure points",
      "Wedge-tenoned leg joints visible as artisan signature on bench top",
      "Compact footprint slides completely underneath Torii Dining Table",
      "Felt glider floor protectors pre-installed on every leg"
    ]
  }
];

const RAW_SIGNATURE_PRODUCTS = [
  {
    "id": "fur-travertine-table",
    "name": "Aura Monolithic Travertine Coffee Table",
    "category": "Living Room",
    "itemType": "table",
    "price": 540,
    "originalPrice": 640,
    "rating": 4.9,
    "reviewCount": 31,
    "badge": "Curator Pick",
    "material": "Honed Roman Navona Travertine & Solid Smoked Teak Plinth",
    "dimensions": "W 120cm × D 70cm × H 36cm",
    "finish": "Penetrating Matte Stone Sealant & Natural Teak Oil",
    "leadTime": "In Stock in Daun Penh Showroom",
    "image": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Navona Cream",
        "hex": "#E8E2D5",
        "inStock": true
      },
      {
        "name": "Silver Vein",
        "hex": "#C5BFB5",
        "inStock": true
      }
    ],
    "description": "Cut from monolithic Roman travertine blocks with soft organic bullnose edges. The natural open-pore cavities are preserved to celebrate geological honesty, hovering weightlessly atop an interlocking smoked teak foundation.",
    "features": [
      "Monolithic 30mm double-bevelled natural travertine slab",
      "Interlocking notched Burmese teak cross-brace plinth",
      "Hand-buffed natural matte sealer repels red wine and coffee",
      "Each stone specimen displays unique ancient sediment veins"
    ]
  },
  {
    "id": "fur-soma-chair",
    "name": "Soma Curved Lounge Chair",
    "category": "Living Room",
    "itemType": "chair",
    "price": 410,
    "originalPrice": 480,
    "rating": 4.8,
    "reviewCount": 27,
    "badge": "New Arrival",
    "material": "Hand-Spun Raw Bouclé & Steam-Bent Beechwood",
    "dimensions": "W 84cm × D 90cm × H 76cm (Seat Height 41cm)",
    "finish": "Natural Steam-Bent Beech & Textured Linen-Bouclé Blend",
    "leadTime": "24–48 Hours Dispatch",
    "image": "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Raw Ecru",
        "hex": "#ECE6DC",
        "inStock": true
      },
      {
        "name": "Fossil Grey",
        "hex": "#7D7B7A",
        "inStock": true
      }
    ],
    "description": "A sculptural celebration of curved tension and plush ergonomics. The Soma features steam-bent timber rails that cradle an oversized lumbar pillow upholstered in high-twist French nubuck fleece.",
    "features": [
      "Continuous steam-formed arch frame engineered without metal brackets",
      "Multi-density cloud core cushion with ergonomic cervical curvature",
      "Stain-resistant fluorocarbon-free textile treatment",
      "Hidden felt floor glide system protects hardwood surfaces"
    ]
  },
  {
    "id": "fur-teak-dining",
    "name": "Kanso Teak Dining Table",
    "category": "Dining Room",
    "itemType": "table",
    "price": 820,
    "originalPrice": 950,
    "rating": 5.0,
    "reviewCount": 38,
    "badge": "Masterpiece",
    "material": "Reclaimed Re-sawn Teak with Cast Iron Tie-Rods",
    "dimensions": "L 220cm × W 100cm × H 76cm",
    "finish": "Raw Sanded Teak with Cold-Pressed Flaxseed Oil",
    "leadTime": "3–5 Days Handcrafted Batch",
    "image": "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Golden Honey Teak",
        "hex": "#B8860B",
        "inStock": true
      },
      {
        "name": "Aged Weathered Grey",
        "hex": "#8F8B82",
        "inStock": true
      }
    ],
    "description": "Sourced from historical timber beams and re-milled by master joiners. The Kanso Teak Table preserves authentic hand-hewn axe marks and tight grain rings that only centuried teakwood possesses.",
    "features": [
      "Naturally waterproof timber rich in natural silica and protective resins",
      "Hand-forged blackened iron tension rods provide seismic stability",
      "Bookmatched tabletop grain with traditional wooden spline keys",
      "Comfortably accommodates 8 to 10 dinner guests"
    ]
  },
  {
    "id": "fur-vesper-sideboard",
    "name": "Vesper Fluted Marble Sideboard",
    "category": "Storage",
    "itemType": "storage",
    "price": 740,
    "originalPrice": 860,
    "rating": 4.9,
    "reviewCount": 24,
    "badge": "Signature",
    "material": "Italian Carrara White Marble & Fluted Ebony Ash",
    "dimensions": "W 160cm × D 48cm × H 72cm",
    "finish": "Silky Matte Honed Marble & Deep Charcoal Ash",
    "leadTime": "In Stock (Immediate Dispatch)",
    "image": "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Ebony & White Marble",
        "hex": "#222222",
        "inStock": true
      },
      {
        "name": "Smoked Ash & Grigio",
        "hex": "#48433F",
        "inStock": true
      }
    ],
    "description": "Harmonizing cool Italian marble with rich vertical fluted woodworking. Two push-to-open fluted cabinet doors conceal adjustable wine stemware racks and velvet-lined silver organizers.",
    "features": [
      "Solid 20mm Italian Carrara marble top slab with rounded safety chamfers",
      "Precision CNC-fluted solid ash cabinet faces with hidden soft-close hinges",
      "Integrated magnetic cable management portals for audio equipment",
      "Solid brushed brass pedestal base with micro-leveling glides"
    ]
  }
];

const RAW_FEATURED_PRODUCTS = [
  {
    "id": "fur-komorebi-nightstand",
    "name": "Komorebi Floating Bedside Console",
    "category": "Bedroom",
    "itemType": "storage",
    "price": 230,
    "originalPrice": 280,
    "rating": 4.8,
    "reviewCount": 21,
    "badge": "Compact Living",
    "material": "Solid American Black Walnut & Brushed Copper Pulls",
    "dimensions": "W 52cm × D 38cm × H 32cm",
    "finish": "Satin Hand-Rubbed Walnut Wax",
    "leadTime": "In Stock",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "American Walnut",
        "hex": "#4A3728",
        "inStock": true
      },
      {
        "name": "Natural Ash",
        "hex": "#DDD2C3",
        "inStock": true
      }
    ],
    "description": "A wall-mounted floating silhouette designed to create an airy, unencumbered bedside space. Features a silent-gliding dovetail drawer and a concealed lower open nook for nightly reading.",
    "features": [
      "Heavy-duty French cleat mounting hardware supports up to 45kg load",
      "Undermount soft-close drawer glide mechanism with silent dampening",
      "Rear notch accommodates lamp cords and wireless charging pads",
      "Solid timber dovetail drawer box with aromatic cedar bottom"
    ]
  },
  {
    "id": "fur-tate-cane-chair",
    "name": "Tate Woven Cane Dining Armchair",
    "category": "Dining Room",
    "itemType": "chair",
    "price": 290,
    "originalPrice": 340,
    "rating": 4.8,
    "reviewCount": 42,
    "badge": "Best Seller",
    "material": "Natural Rattan Cane Weave & Solid Teak Frame",
    "dimensions": "W 56cm × D 58cm × H 82cm (Seat Height 45cm)",
    "finish": "Natural Blonde Rattan & Protective Teak Wax",
    "leadTime": "In Stock (Immediate Dispatch)",
    "image": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Natural Honey Cane",
        "hex": "#D6B88D",
        "inStock": true
      },
      {
        "name": "Blackened Teak",
        "hex": "#22211F",
        "inStock": true
      }
    ],
    "description": "Handwoven in a classic octagonal French cane pattern, the Tate chair combines tropical lightness with the rock-solid structure of kiln-dried plantation teak. The breathable weave keeps you cool through lengthy family dinners.",
    "features": [
      "Eight-way double hand-caned backrest and reinforced seat pan",
      "Tenoned teak frame resistant to high humidity and tropical climates",
      "Slightly inclined back angle relieves lumbar tension while dining",
      "Stackable up to 3 units high for flexible space planning"
    ]
  },
  {
    "id": "fur-oasis-desk",
    "name": "Oasis Travertine Console Desk",
    "category": "Office",
    "itemType": "desk",
    "price": 580,
    "originalPrice": 690,
    "rating": 4.8,
    "reviewCount": 16,
    "badge": "Limited Run",
    "material": "Beige Persian Travertine & Solid Cast Bronze Pylons",
    "dimensions": "W 130cm × D 55cm × H 74cm",
    "finish": "Polished Travertine Slab with Waxed Cast Bronze",
    "leadTime": "3–5 Days Handcrafted Batch",
    "image": "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Warm Travertine",
        "hex": "#DDD3C1",
        "inStock": true
      },
      {
        "name": "Dark Walnut & Bronze",
        "hex": "#4C3828",
        "inStock": true
      }
    ],
    "description": "Bridging the boundary between executive console and sculptural writing bureau. Two cylindrical bronze pylons elevate a honed Persian travertine top complete with an integrated cable cutaway and leather blotter inlay.",
    "features": [
      "Honed monolithic stone work surface impervious to ballpoint indentations",
      "Sculptural bronze-toned steel cylinder base provides vibration-free stability",
      "Integrated magnetic underside clips keep power cables completely invisible",
      "Compact 55cm depth perfectly tailored for modern bedroom and office nooks"
    ]
  },
  {
    "id": "fur-solstice-pendant",
    "name": "Solstice Brass & Paper Pendant",
    "category": "Lighting",
    "itemType": "lighting",
    "price": 160,
    "originalPrice": 195,
    "rating": 4.9,
    "reviewCount": 25,
    "badge": "New Release",
    "material": "Spun Antiqued Brass & Handmade Kozo Paper Diffuser",
    "dimensions": "Diameter 52cm × H 32cm (180cm Adjustable Cord)",
    "finish": "Patinated Brushed Raw Brass & Natural Fibers",
    "leadTime": "In Stock",
    "image": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
    "colors": [
      {
        "name": "Aged Brass",
        "hex": "#B59E5F",
        "inStock": true
      },
      {
        "name": "Matte Black",
        "hex": "#1C1B1A",
        "inStock": true
      }
    ],
    "description": "Suspended overhead dining tables or reading corners, the Solstice pendant casts a downward focused pool of warm light while gently filtering glow upward through its fibrous kozo paper shade.",
    "features": [
      "Solid spun brass dome with hand-applied oxidation patina",
      "Japanese Kozo paper lower diffuser eliminates harsh filament glare",
      "Supplied with 1.8m braided taupe linen cord and matching brass ceiling canopy",
      "Universal E26/E27 ceramic socket, dimmer-compatible with warm LEDs"
    ]
  }
];

const enrichProduct = (p, idx) => {
  const stockCount = p.stockCount !== undefined ? p.stockCount : ((idx % 3 === 0) ? 3 : 8);
  const inStock = p.inStock !== undefined ? p.inStock : (stockCount > 0);
  const sku = p.sku || `FUR-${p.id.replace(/^(fur|anti)-/, '').toUpperCase()}`;

  const widthMatch = p.dimensions?.match(/W\s*([\d\w\.]+)/i) || p.dimensions?.match(/L\s*([\d\w\.]+)/i);
  const depthMatch = p.dimensions?.match(/D\s*([\d\w\.]+)/i);
  const heightMatch = p.dimensions?.match(/H\s*([\d\w\.]+)/i);
  const seatHeightMatch = p.dimensions?.match(/Seat Height\s*([\d\w\.]+)/i);

  const detailedDimensions = p.detailedDimensions || {
    width: widthMatch ? widthMatch[1] : (p.dimensions || 'Standard'),
    depth: depthMatch ? depthMatch[1] : 'Standard',
    height: heightMatch ? heightMatch[1] : 'Standard',
    seatHeight: seatHeightMatch ? seatHeightMatch[1] : undefined
  };

  const defaultReviews = [
    {
      id: `rev-${p.id}-1`,
      author: 'Sophea C.',
      verified: true,
      date: 'Recent',
      rating: 5,
      title: 'Remarkable craftsmanship and timber finish',
      comment: `The timber grain on this ${p.name.toLowerCase()} is breathtaking in person. Solid, tactile, and flawless white-glove setup.`,
      location: 'Phnom Penh'
    },
    {
      id: `rev-${p.id}-2`,
      author: 'David V.',
      verified: true,
      date: '2 weeks ago',
      rating: 5,
      title: 'Far superior to imported flat-pack items',
      comment: 'You can immediately feel the weight and strength of traditional mortise joinery. Heirloom quality.',
      location: 'Siem Reap'
    }
  ];

  return {
    ...p,
    gallery: [p.image],
    inStock,
    stockCount,
    sku,
    weight: p.weight || '38 kg',
    careGuide: p.careGuide || 'Dust regularly with a dry microfibre cloth. Treat wood with organic hardwax or linseed oil once or twice a year to preserve moisture and luster.',
    detailedDimensions,
    reviewsList: p.reviewsList || defaultReviews
  };
};

export const SIGNATURE_PRODUCTS = RAW_SIGNATURE_PRODUCTS.map((p, idx) => enrichProduct(p, idx + 8));
export const FEATURED_PRODUCTS = RAW_FEATURED_PRODUCTS.map((p, idx) => enrichProduct(p, idx + 12));

export const ALL_PRODUCTS = [
  ...RAW_BASE_PRODUCTS.map((p, idx) => enrichProduct(p, idx)),
  ...SIGNATURE_PRODUCTS,
  ...FEATURED_PRODUCTS
];

export const TESTIMONIALS = [
  {
    "id": 1,
    "quote": "The Kanso sofa transformed our BKK1 apartment. The solid oak foundation feels indestructible, while the bouclé fabric has held up wonderfully against everyday spills and our two cats.",
    "author": "Sophea & Jean-Marc",
    "role": "Architects, Phnom Penh",
    "rating": 5
  },
  {
    "id": 2,
    "quote": "Theng Seyha personally coordinated white-glove delivery to our Siem Reap gallery residence. Watching the team assemble the Torii dining table with traditional joinery was pure delight.",
    "author": "Vireak Chan",
    "role": "Art Director, Siem Reap",
    "rating": 5
  },
  {
    "id": 3,
    "quote": "Fur proves that you don't have to import flat-pack veneer junk to have timeless Scandinavian-Japanese aesthetics in Cambodia. The solid walnut credenza is a true heirloom piece.",
    "author": "Elena Rostova",
    "role": "Interior Stylist",
    "rating": 5
  }
];

export const BLOG_POSTS = [
  {
    "id": 1,
    "title": "Why We Choose Appalachian White Oak Over Engineered MDF",
    "date": "March 14, 2025",
    "readTime": "4 min read",
    "author": "Theng Seyha",
    "image": "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80",
    "content": [
      "Modern furniture has become overwhelmingly disposable. Engineered particle boards off-gas volatile formaldehyde and degrade at the first hint of tropical humidity.",
      "At Fur, every timber plank is kiln-dried to an exact 8–10% equilibrium moisture content before being dimensioned by hand. White oak naturally contains high levels of tannic acid, rendering it resilient against pests and fungal decay without artificial synthetic chemical coatings.",
      "When you touch our furniture, you feel the authentic warmth and grain pores of real living timber—a material that gains character, warmth, and depth as it ages with your household."
    ]
  },
  {
    "id": 2,
    "title": "Designing for Compact City Apartments: The Rule of Low Horizons",
    "date": "February 28, 2025",
    "readTime": "5 min read",
    "author": "Studio Design Team",
    "image": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
    "content": [
      "Urban living spaces in growing Southeast Asian metropolises often feature ceiling heights between 2.6m and 2.9m. Filling these volumes with high-backed, bulky furniture fragments natural window light and creates visual claustrophobia.",
      "By dropping sofa and bed heights by even 8–10 centimeters, sightlines across rooms remain unobstructed. Natural daylight bounces deeper into floorplans, and rooms feel expansive and calm.",
      "Our Kanso and Nami collections are designed specifically with this low horizontal geometry in mind."
    ]
  },
  {
    "id": 3,
    "title": "The Ritual of Natural Plant Wax: Caring for Solid Wood Furniture",
    "date": "January 18, 2025",
    "readTime": "3 min read",
    "author": "Master Carver Khem",
    "image": "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=800&q=80",
    "content": [
      "Unlike synthetic polyurethane plastic coatings that seal wood under an impenetrable, un-repairable layer of clear resin, our plant-based hardwax penetrates into the wood pores while allowing the timber to breathe.",
      "A minor scratch or cup ring does not require stripping the entire table down to raw timber. A drop of organic linseed wax buffed with a soft linen cloth cures the surface in minutes.",
      "We include an artisan care tin with every major piece ordered through our showroom or Telegram concierge."
    ]
  }
];
