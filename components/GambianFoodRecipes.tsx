'use client'
import { useState } from 'react'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

type Recipe = {
  name: string
  icon: string
  type: string
  servings: string
  time: string
  difficulty: string
  description: string
  ingredients: string[]
  steps: string[]
  tip: string
  color: string
}

const RECIPES: Recipe[] = [
  {
    name: 'Domoda',
    icon: '🥜',
    type: 'Main Course — National Dish',
    servings: '4–6',
    time: '60 min',
    difficulty: 'Medium',
    description: 'The undisputed national dish of The Gambia — a rich, deeply savoury groundnut (peanut butter) stew served over steamed white rice. Every Gambian household has its own version.',
    color: '#92400e',
    ingredients: [
      '500g beef or chicken, cubed',
      '250ml smooth peanut butter (natural, no sugar)',
      '2 large tomatoes, blended',
      '2 tbsp tomato purée',
      '1 large onion, finely chopped',
      '2 cloves garlic, minced',
      '1 scotch bonnet pepper',
      '2 cups pumpkin or butternut squash, diced',
      '1 cup cassava leaves (optional)',
      '3 cups water or stock',
      'Salt, pepper, stock cube',
      '3 tbsp vegetable oil',
      'Steamed white rice to serve',
    ],
    steps: [
      'Season meat with salt, pepper, and half the garlic. Brown in oil over high heat for 5 min.',
      'Add onion to the same pot. Cook until golden, about 5 min.',
      'Add blended tomatoes, tomato purée, remaining garlic, and stock cube. Simmer 10 min.',
      'Stir in peanut butter gradually, adding water to thin to a thick soup consistency.',
      'Add meat back to pot. Add squash and whole scotch bonnet. Simmer 30 min.',
      'Add cassava leaves if using. Adjust salt and consistency with water.',
      'Simmer until oil separates and rises to the top — that\'s when it\'s ready.',
      'Remove scotch bonnet (or mash in for extra heat). Serve over steamed white rice.',
    ],
    tip: 'The key to authentic Domoda is patience — long slow cooking makes the peanut stew deepen and the oil to separate on top. Natural peanut butter (not the sweetened kind) is essential.',
  },
  {
    name: 'Benachin',
    icon: '🍚',
    type: 'Main Course — Gambian Jollof',
    servings: '6–8',
    time: '75 min',
    difficulty: 'Medium',
    description: 'Gambia\'s version of the legendary West African Jollof rice — cooked in a rich tomato and spice base with fish or chicken until every grain is infused with flavour.',
    color: '#b91c1c',
    ingredients: [
      '3 cups long-grain parboiled rice, washed',
      '1 whole fish (tilapia or bonga), or 500g chicken',
      '2 large tomatoes, blended',
      '1 large onion, blended + 1 sliced',
      '3 tbsp tomato purée',
      '2 scotch bonnet peppers',
      '1 cup cabbage, wedged',
      '2 carrots, halved',
      '1 cup cassava or sweet potato, chunked',
      'Baobab powder (optional, for depth)',
      '3 tbsp vegetable oil',
      'Stock cube, salt, black pepper',
      '4 cups water',
    ],
    steps: [
      'Fry sliced onion in oil until golden. Add blended onion, tomato, tomato purée. Cook 15 min until thick.',
      'Season fish or chicken. Add to the tomato base. Cook 10 min each side.',
      'Remove protein. Add water, stock cube, baobab powder, scotch bonnet. Bring to boil.',
      'Add washed rice. Stir once. Reduce heat to low. Cover tightly.',
      'After 15 min, place vegetables and protein on top. Cover and cook on lowest heat 20 more min.',
      'Check rice is cooked and no liquid remains. The bottom layer should be slightly crispy (the prized "party jollof" crust).',
      'Fluff and serve with fried plantain or salad.',
    ],
    tip: 'The slightly burnt, smoky bottom crust (called "bottom pot") is a delicacy in Gambian cooking — cook on low heat without stirring to achieve it.',
  },
  {
    name: 'Chicken Yassa',
    icon: '🍋',
    type: 'Main Course — Festive',
    servings: '4',
    time: '90 min (+ marination)',
    difficulty: 'Easy',
    description: 'A Senegambian classic — chicken grilled or roasted, then smothered in a tangy caramelised onion and lemon sauce. Bright, bold, and irresistibly aromatic.',
    color: '#a16207',
    ingredients: [
      '1 whole chicken, jointed (or 8 pieces)',
      '4 large onions, thinly sliced',
      'Juice of 4 lemons',
      '4 tbsp Dijon mustard',
      '4 cloves garlic, minced',
      '2 scotch bonnet peppers, sliced',
      '3 tbsp vegetable oil',
      '1 tsp black pepper',
      '1 bay leaf',
      'Salt to taste',
      'Steamed white rice to serve',
    ],
    steps: [
      'Marinate chicken pieces in lemon juice, half the onions, mustard, garlic, pepper, scotch bonnet for at least 2 hours (overnight is best).',
      'Remove chicken from marinade. Reserve the marinade.',
      'Grill or pan-fry chicken pieces over high heat until browned on both sides. Set aside.',
      'In a large pot, heat oil. Add remaining fresh onions. Cook on medium-low heat 25 min until deeply caramelised.',
      'Add reserved marinade to the pot. Simmer 10 min.',
      'Return grilled chicken to pot. Add bay leaf. Simmer 20 min until tender.',
      'Adjust salt and acidity. Sauce should be tangy, savoury, and glossy.',
      'Serve over steamed white rice with fried plantain.',
    ],
    tip: 'The caramelisation of onions is non-negotiable — rushing this step loses the depth that makes Yassa extraordinary. Take 25–30 minutes and let them go golden brown.',
  },
  {
    name: 'Superkanja',
    icon: '🌿',
    type: 'Stew — Rich & Savoury',
    servings: '4',
    time: '50 min',
    difficulty: 'Easy',
    description: 'A thick, deeply savoury okra stew made with smoked fish, oysters, or meat. The "super" refers to its reputation as the most nutritious meal in the Gambian diet.',
    color: '#166534',
    ingredients: [
      '500g fresh okra, sliced into rounds',
      '250g smoked fish (or dried oysters)',
      '200g beef (optional)',
      '2 large onions, chopped',
      '2 tomatoes, chopped',
      '2 tbsp tomato purée',
      '1 scotch bonnet pepper',
      '2 tbsp palm oil (or vegetable oil)',
      'Stock cube, salt',
      '2 cups water',
      'Steamed rice or fufu to serve',
    ],
    steps: [
      'Boil okra in salted water for 5 min. Drain and set aside — this reduces sliminess slightly while retaining texture.',
      'Fry onion in palm oil until softened. Add tomato, tomato purée, scotch bonnet. Cook 10 min.',
      'Add smoked fish and beef. Cook 10 min until fragrant.',
      'Add water and stock cube. Bring to boil.',
      'Add okra. Stir gently to combine. Simmer 15–20 min until stew thickens naturally from the okra.',
      'Season with salt. The texture should be thick, almost gel-like — that\'s the authentic consistency.',
      'Serve over white rice or with fufu.',
    ],
    tip: 'Palm oil gives Superkanja its characteristic deep orange colour and distinctive flavour. Do not substitute with regular oil if you want the authentic taste.',
  },
  {
    name: 'Akara',
    icon: '🫘',
    type: 'Street Food — Breakfast',
    servings: '12 fritters',
    time: '30 min',
    difficulty: 'Easy',
    description: 'Crispy black-eyed pea fritters fried until golden — a beloved West African street food eaten for breakfast with bread, porridge, or on their own with hot sauce.',
    color: '#1e3a5f',
    ingredients: [
      '2 cups dried black-eyed peas',
      '1 medium onion, roughly chopped',
      '1 scotch bonnet pepper (optional)',
      '1 tsp salt',
      'Vegetable oil for deep frying',
    ],
    steps: [
      'Soak black-eyed peas in cold water for 4 hours or overnight. Rub between hands to remove skins. Drain and rinse until water runs clear.',
      'Blend soaked peas with onion and scotch bonnet (no water, or just a splash) until very smooth and fluffy.',
      'Add salt. Beat the batter vigorously with a spoon — this incorporates air for a lighter fritter.',
      'Heat oil in a deep pan to 180°C.',
      'Drop heaped tablespoons of batter into the hot oil. Fry 3–4 min, turning once, until deep golden brown.',
      'Drain on paper towels. Serve immediately with hot sauce or alongside bread.',
    ],
    tip: 'Beating air into the batter is the secret to light, puffy Akara rather than dense heavy ones. Beat for at least 3 minutes until the batter becomes noticeably fluffy.',
  },
  {
    name: 'Tapalapa Bread',
    icon: '🍞',
    type: 'Baked — Staple',
    servings: '2 loaves',
    time: '2.5 hrs',
    difficulty: 'Medium',
    description: 'The iconic Gambian bread baked in traditional wood-fired ovens — a dense, crusty loaf with a soft interior, a cornerstone of every Gambian breakfast and sold at roadsides across the country.',
    color: '#78350f',
    ingredients: [
      '4 cups plain flour (or millet flour blend)',
      '1 sachet (7g) instant yeast',
      '1.5 tsp salt',
      '1 tsp sugar',
      '1.5 cups warm water',
      '1 tbsp vegetable oil',
    ],
    steps: [
      'Mix yeast and sugar in warm water. Leave 5 min until frothy.',
      'Combine flour and salt in a large bowl. Make a well, add yeast mixture and oil.',
      'Knead on a floured surface for 10 min until smooth and elastic.',
      'Cover and leave to rise in a warm place for 1 hour until doubled in size.',
      'Punch down dough. Shape into 2 oval loaves. Place on a greased baking tray.',
      'Leave to prove for 30 more minutes.',
      'Preheat oven to 220°C. Score the top of each loaf with a knife.',
      'Bake 25–30 min until deep golden brown and hollow-sounding when tapped underneath.',
      'Cool on a wire rack before slicing. Serve with butter, Domoda, or tea.',
    ],
    tip: 'Authentic Tapalapa uses a mix of millet and wheat flour, giving a slightly denser, earthier flavour. Add 1 cup of millet flour in place of 1 cup plain flour for a more traditional result.',
  },
  {
    name: 'Chakery',
    icon: '🥛',
    type: 'Dessert — Festive',
    servings: '6',
    time: '20 min + chill',
    difficulty: 'Easy',
    description: 'A creamy, lightly sweet Gambian dessert made from couscous, yoghurt, sweetened condensed milk, and tropical fruit — served chilled at weddings, naming ceremonies, and celebrations.',
    color: '#5b21b6',
    ingredients: [
      '2 cups fine couscous',
      '500ml plain yoghurt (full fat)',
      '200ml sweetened condensed milk',
      '1 cup diced mango or pineapple',
      '1 banana, sliced',
      '1 tsp vanilla extract',
      'Pinch of nutmeg',
      'Raisins to garnish (optional)',
    ],
    steps: [
      'Place couscous in a bowl. Pour 2 cups boiling water over it. Cover and leave 5 min, then fluff with a fork. Cool completely.',
      'Mix yoghurt, condensed milk, and vanilla extract in a large bowl.',
      'Fold cooled couscous into the yoghurt mixture.',
      'Add diced mango, pineapple, and banana. Fold gently.',
      'Sprinkle nutmeg on top. Cover and refrigerate for at least 1 hour.',
      'Serve chilled in bowls, garnished with raisins and extra fruit.',
    ],
    tip: 'Chakery gets better the longer it chills — overnight is ideal as the couscous absorbs the yoghurt and flavours deepen. Make it the day before any celebration.',
  },
]

export default function GambianFoodRecipes() {
  const [active, setActive] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filtered = RECIPES.filter(r =>
    search === '' || r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search recipes..."
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 14, boxSizing: 'border-box' }}
        />
      </div>

      {/* Recipe Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map((r, i) => (
          <div key={r.name} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', overflow: 'hidden', transition: 'box-shadow 0.2s' }}>
            <div style={{ height: 80, background: `linear-gradient(135deg, ${r.color}, ${r.color}cc)`, display: 'flex', alignItems: 'center', padding: '0 1.25rem', gap: 12 }}>
              <span style={{ fontSize: 40 }}>{r.icon}</span>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{r.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{r.type}</div>
              </div>
            </div>
            <div style={{ padding: '1rem 1.1rem' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {[['⏱', r.time], ['👤', r.servings], ['📊', r.difficulty]].map(([ic, val]) => (
                  <span key={val} style={{ fontSize: 11, background: '#f3f4f6', borderRadius: 6, padding: '3px 8px', color: '#374151', fontWeight: 600 }}>
                    {ic} {val}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 0.75rem', lineHeight: 1.5 }}>{r.description}</p>
              <button
                onClick={() => setActive(active === i ? null : i)}
                style={{ background: active === i ? DARK : G, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%' }}
              >
                {active === i ? '▲ Hide Recipe' : '▼ View Full Recipe'}
              </button>
            </div>

            {active === i && (
              <div style={{ borderTop: '1.5px solid #e5e7eb', padding: '1.1rem' }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: DARK, margin: '0 0 0.5rem' }}>Ingredients</h4>
                <ul style={{ margin: '0 0 1rem', paddingLeft: 18 }}>
                  {r.ingredients.map(ing => (
                    <li key={ing} style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>{ing}</li>
                  ))}
                </ul>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: DARK, margin: '0 0 0.5rem' }}>Method</h4>
                <ol style={{ margin: '0 0 1rem', paddingLeft: 18 }}>
                  {r.steps.map(step => (
                    <li key={step} style={{ fontSize: 12, color: '#374151', lineHeight: 1.8, marginBottom: 4 }}>{step}</li>
                  ))}
                </ol>
                <div style={{ background: '#fefce8', borderLeft: `3px solid ${GOLD}`, padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>💡 Pro Tip: </span>
                  <span style={{ fontSize: 12, color: '#78350f' }}>{r.tip}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
