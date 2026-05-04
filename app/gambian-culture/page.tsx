'use client'
import { useState } from 'react'
import Link from 'next/link'
import CulturalProverbWidget from '../../components/CulturalProverbWidget'
import GambianFoodRecipes from '../../components/GambianFoodRecipes'
import CulturalQuiz from '../../components/CulturalQuiz'

const G = '#1B4D3E'
const GOLD = '#C4943A'
const DARK = '#0F3D21'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const ETHNIC_GROUPS = [
  { name: 'Mandinka', pct: '34–42%', icon: '🪘', color: '#92400e', desc: 'The largest ethnic group in The Gambia. Their roots trace to the Mali Empire. Mandinka communities are known for griot (jali) traditions, kora music, agriculture, and deep spiritual life. The Kankurang masquerade is a Mandinka tradition inscribed on UNESCO\'s heritage list.', traits: ['Griot & Kora tradition', 'Kankurang masquerade', 'Agriculture & rice cultivation', 'Islam deeply embedded', 'Sunjata Epic heritage'] },
  { name: 'Fula (Fulani)', pct: '22–25%', icon: '🐄', color: '#0e7490', desc: 'Pastoralists of extraordinary range — the Fula people span West Africa from Senegal to Sudan. In The Gambia they are known for cattle herding, fine traditional clothing, and graceful culture. The Fula are predominantly Muslim and have a strong tradition of Islamic scholarship.', traits: ['Cattle herding & pastoralism', 'Fine embroidered garments', 'Islamic scholarship', 'Fulani braiding & jewellery', 'Widespread across West Africa'] },
  { name: 'Wolof', pct: '12–16%', icon: '🎵', color: '#7c3aed', desc: 'Urban traders and cultural trendsetters, the Wolof are the dominant group in Senegal and a significant presence in Gambia\'s cities. Wolof music, fashion, and cuisine have a disproportionate influence on regional culture. The Sabar drum and Wolof griot traditions are especially vibrant.', traits: ['Urban commerce & trading', 'Sabar drumming tradition', 'Fashion & textile influence', 'Wolof language as urban lingua franca', 'Strong griot culture'] },
  { name: 'Jola (Diola)', pct: '9–10%', icon: '🌿', color: '#166534', desc: 'Forest dwellers of the south, the Jola are known for strong pre-Islamic spiritual traditions, fierce independence, and spectacular masquerades. The Kumpo and Zimba masquerades are Jola traditions. The Bougarabou drum set is central to Jola ceremony and celebration.', traits: ['Kumpo masquerade', 'Bougarabou drumming', 'Traditional spiritual beliefs', 'Forest cultivation', 'Resistance & independence'] },
  { name: 'Soninke (Serahule)', pct: '~8%', icon: '💎', color: '#b45309', desc: 'Descendants of the ancient Ghana Empire and long-distance traders, the Soninke have a historic association with gold, salt, and trans-Saharan commerce. In The Gambia they are prominent in finance, trade, and business. Their Serahule language preserves connections to ancient kingdoms.', traits: ['Ancient trading networks', 'Gold & salt commerce', 'Ghana Empire heritage', 'Business & finance prominence', 'Serahule language preservation'] },
  { name: 'Serer', pct: '~3%', icon: '⭐', color: '#be185d', desc: 'The Serer are one of the oldest peoples of the Senegambian region, known for maintaining pre-Islamic traditions, complex agricultural practices, and strong community governance structures. They are associated with the ancient Sine and Saloum kingdoms.', traits: ['Ancient Senegambian heritage', 'Pre-Islamic traditions', 'Complex agricultural systems', 'Sine-Saloum kingdom heritage', 'Strong oral history'] },
  { name: 'Manjago', pct: '~2%', icon: '🎏', color: '#0369a1', desc: 'The Manjago (Mancanha) are a Guinean-Bissau-origin people who settled in The Gambia. They maintain strong traditional animist beliefs alongside Islam and Christianity. They are known for their palm wine tapping tradition and beautiful woven cloth.', traits: ['Palm wine tradition', 'Woven cloth & textiles', 'Animist traditions', 'Guinean-Bissau heritage', 'Strong community bonds'] },
  { name: 'Aku (Creole)', pct: '<1%', icon: '⚓', color: '#1e3a5f', desc: 'The Aku are descendants of freed slaves who settled in Banjul (then Bathurst) in the 19th century. They built the foundation of Gambian urban and professional life. The Aku community contributed heavily to education, law, and the civil service. Many are Christians and maintain a Krio-influenced culture.', traits: ['Freed slave heritage', 'Urban professional tradition', 'Christianity & Western education', 'Krio language traces', 'Banjul founding community'] },
]

const LANGUAGES = [
  { name: 'English', role: 'Official Language', speakers: 'Government & education', icon: '📋', desc: 'The official language of The Gambia, used in government, courts, education, and business. A legacy of British colonial rule.' },
  { name: 'Mandinka', role: 'Most Widely Spoken', speakers: '~40% as first language', icon: '🗣️', desc: 'The most widely spoken first language. Belongs to the Mande language family. Rich in proverbs and oral literature. Core greetings: "I be ding?" (How are you?) / "Ding dorong" (Fine).' },
  { name: 'Wolof', role: 'Urban Lingua Franca', speakers: 'Widely understood in cities', icon: '🏙️', desc: 'Increasingly spoken across Gambian towns as a trade language. Brought Wolof cultural influence into fashion, music, and urban slang. Key phrase: "Naka nga def?" (How are you?).' },
  { name: 'Fula (Pulaar)', role: 'Widely Spoken', speakers: '~22% as first language', icon: '🌾', desc: 'Spoken across West Africa from Gambia to Sudan. The Fula of Gambia speak the Pulaar dialect. Rich in cattle terminology and pastoral metaphors. Key phrase: "No mbad?" (How are you?).' },
  { name: 'Jola-Fonyi', role: 'Southern Gambia', speakers: '~9% as first language', icon: '🌳', desc: 'Spoken primarily in the Foni and Casamance regions. Tonal language with complex verb structure. Jola communities fiercely preserve their language as part of cultural identity.' },
  { name: 'Serahule (Soninke)', role: 'Eastern Gambia', speakers: '~8% as first language', icon: '🏺', desc: 'Spoken mainly in the North Bank and Upper River regions. Connects to the ancient Ghana Empire and trans-Saharan trade networks. Contains extensive vocabulary for commerce and governance.' },
]

const MUSIC = [
  { name: 'Kora', icon: '🎵', color: '#92400e', desc: 'The kora is a 21-string harp-lute built from a large calabash half covered with cow skin. It is one of the most complex and beautiful instruments in world music. Played by griots (jalis), it serves as both musical instrument and historical archive. The two main techniques are kumbengo (the repeating cyclical foundation pattern) and birimintingo (improvised virtuosic runs).' },
  { name: 'Balafon', icon: '🎶', color: '#166534', desc: 'A wooden-key xylophone with resonating calabash gourds beneath each key. The balafon produces a warm, resonant sound and is used in griot ceremonies, celebrations, and storytelling. Ancient versions date back over 700 years in West Africa.' },
  { name: 'Griot Jaliya', icon: '📜', color: '#7c3aed', desc: 'Jaliya is the sacred art of the Mandinka griot (jali). Griots are hereditary musicians, historians, and praise-singers. They preserve the genealogies of noble families, recite the Sunjata Epic, and perform at naming ceremonies, weddings, and funerals. The relationship between a griot and their patron family is passed through generations.' },
  { name: 'Birimintingo', icon: '⚡', color: '#b91c1c', desc: 'The advanced improvisation technique on the kora — cascading streams of notes played at extraordinary speed and precision. Birimintingo is the pinnacle of kora mastery, representing freestyle expression over the kumbengo foundation. Only the most skilled jalis achieve this level of artistry.' },
  { name: 'Kontingo', icon: '🎸', color: '#0e7490', desc: 'A 5-string lute (similar to a banjo) used by Mandinka griots. More portable than the kora, the kontingo is played at intimate gatherings, village ceremonies, and for solo musical storytelling.' },
  { name: 'Riti (Nyanyeru)', icon: '🎻', color: '#be185d', desc: 'A one-string fiddle played by Fula griots (wambaabe). The haunting, soulful sound of the riti is inseparable from Fula pastoral culture — played during cattle journeys, at night under stars, and at ceremonies.' },
]

const DANCES = [
  { name: 'Sewruba', origin: 'Mandinka', icon: '💃', color: '#92400e', desc: 'A traditional Mandinka ceremonial dance performed at weddings, naming ceremonies, and festivals. Women dance in colourful clothes while men play the djembe and kora. Sewruba is about communal joy and gratitude.' },
  { name: 'Kumpo', origin: 'Jola', icon: '🌀', color: '#166534', desc: 'The Kumpo masquerade features a towering, grass-covered figure that spins violently and whirls through crowds at extraordinary speed. Accompanied by the bougarabou drums, the Kumpo performance is one of the most visually spectacular in West Africa.' },
  { name: 'Bugarabu', origin: 'Jola', icon: '🥁', color: '#1e3a5f', desc: 'The Bugarabu is a highly energetic dance performed to the bougarabou drum set (3–4 drums of different pitches). Dancers respond to the drum rhythms with athletic, acrobatic footwork. Originally associated with ceremonies, it is now performed at cultural festivals.' },
  { name: 'Sembo', origin: 'Mandinka', icon: '🤝', color: '#7c3aed', desc: 'A dance of gratitude and hospitality, performed to welcome important guests or to give thanks after a good harvest. The graceful movements of Sembo convey warmth, respect, and communal generosity.' },
  { name: 'Jondon / Wolosodon', origin: 'Mandinka', icon: '🏮', color: '#b45309', desc: 'An initiation dance tied to circumcision ceremonies and the transition to adulthood. Jondon and Wolosodon mark critical life passages and are performed in segregated ceremonies that are central to Mandinka social structure.' },
  { name: 'Dundunbah', origin: 'Mandinka', icon: '⚔️', color: '#b91c1c', desc: 'The warrior dance — performed with dramatic, powerful movements representing strength, bravery, and the spirit of the warrior. Dundunbah is accompanied by the dundun talking drum and creates an atmosphere of fierce energy and pride.' },
  { name: 'Lenjengo', origin: 'Wolof', icon: '🎊', color: '#0369a1', desc: 'A Wolof spirit possession dance associated with the Ndëpp healing ceremony. Performed to honour Wolof spirits (rab), Lenjengo involves trance-like states and is conducted by initiated women under the guidance of a ritual specialist.' },
  { name: 'Kankurang Dance', origin: 'Mandinka', icon: '🎭', color: '#0e7490', desc: 'The ceremonial dance accompanying the Kankurang masquerade — participants in red bark and fibre follow the masquerade figure through villages, singing and calling. This is a sacred performance connected to male initiation rites.' },
]

const DRUMMING = [
  { name: 'Sabar', people: 'Wolof', icon: '🥁', color: '#7c3aed', desc: 'A tall, narrow drum played with one hand and one stick. The Sabar is central to Wolof ceremony, celebration, and dance. Sabar players develop extraordinary technique — the combination of bare-hand slaps and stick strokes creates an intricate, driving polyrhythm.' },
  { name: 'Djembe', people: 'Mandinka / Pan-African', icon: '🪘', color: '#92400e', desc: 'The goblet-shaped hand drum that has become the most recognised African drum globally. In Gambia the djembe is played at Mandinka ceremonies, accompanying dance, wrestling, and celebration. Three sounds — bass, tone, and slap — create the rhythmic vocabulary.' },
  { name: 'Bougarabou', people: 'Jola', icon: '🎵', color: '#166534', desc: 'A set of 3–4 goblet-shaped drums of graduated sizes, each producing a different pitch. Played exclusively with hands, the Bougarabou produces complex interlocking rhythms. It is the central instrument of Jola ceremony and the Bugarabu dance tradition.' },
  { name: 'Dundun (Talking Drum)', people: 'Mandinka / Wolof', icon: '📢', color: '#b45309', desc: 'The hourglass-shaped pressure drum that can mimic the tones of spoken language — hence "talking drum." By squeezing the strings attached to the drum heads, the player changes pitch to convey messages across distances. Used for communication, ceremony, and musical storytelling.' },
  { name: 'Tama', people: 'Wolof / Mandinka', icon: '🔔', color: '#be185d', desc: 'A small version of the talking drum, worn under the arm. The Tama player holds it under one arm and strikes it with a curved stick. Its high-pitched, expressive tones are used to signal greetings, tell stories, and accompany griots.' },
]

const MASQUERADES = [
  { name: 'Kankurang', people: 'Mandinka', icon: '🎭', color: '#b91c1c', heritage: 'UNESCO ICH', desc: 'The most sacred masquerade in The Gambia. The Kankurang is constructed from the red bark of the Faara tree, covering the performer entirely. It represents justice, social control, and the protection of initiates during circumcision rites. The Kankurang is armed with iron blades and is accompanied by singing and calling. It was inscribed on UNESCO\'s Intangible Cultural Heritage list in 2005.' },
  { name: 'Kumpo', people: 'Jola', icon: '🌀', color: '#166534', heritage: 'Traditional', desc: 'A grass-covered masquerade figure that spins at extraordinary speed, creating a spiralling whirlwind effect. The Kumpo is associated with Jola spiritual beliefs and performed at harvest festivals and initiation ceremonies. Its wild, unpredictable movement represents spiritual power.' },
  { name: 'Zimba', people: 'Wolof/Lebu', icon: '🦁', color: '#7c3aed', heritage: 'Traditional', desc: 'An animal-inspired masquerade using carved wooden masks. The Zimba represents powerful animal spirits and is performed at specific ceremonial occasions. Less common than the Kankurang, the Zimba tradition is maintained by specialist families.' },
  { name: 'Nianthio', people: 'Mandinka', icon: '🌿', color: '#0e7490', heritage: 'Traditional', desc: 'A youth masquerade performed during Ramadan and festive seasons. Less sacred than the Kankurang, the Nianthio entertains communities and is a way for young men to learn traditional performance arts.' },
]

const WRESTLING = {
  name: 'Borreh — Traditional Wrestling',
  desc: 'Borreh is the national sport of The Gambia. Traditional Gambian wrestling predates formal sport — it is deeply embedded in cultural identity, masculinity, and community celebration. A match begins with elaborate pre-fight rituals: wrestlers wear protective charms (grisgris) given by their spiritual advisors, griots sing their praises, and drummers build the energy to fever pitch before the wrestlers even touch.',
  rules: ['Win by throwing the opponent to the ground', 'The wrestler who touches the ground with anything above the knee loses', 'No punching — pure grappling technique', 'Matches held in a sandy arena (lumo)', 'Wrestlers from different villages compete in regional tournaments'],
  cultural: ['Accompanied by djembe drumming and griot praise-singing', 'Wrestlers wear protective amulets (grisgris)', 'Winning is a matter of enormous community pride', 'Famous wrestling centres: Soma, Banjul, Paradise Beach', 'Scouts from abroad have recruited Gambian wrestlers for international competition'],
  hubs: ['Soma Wrestling Arena', 'Paradise Beach Events', 'Banjul Independence Stadium', 'Regional village lumos'],
}

const GRIOT = {
  desc: 'The griot (jali in Mandinka, gewel in Wolof, gawlo in Fula) is one of the most extraordinary cultural figures in West Africa. Griots are hereditary musicians, historians, praise-singers, and living archives. They are born into griot families and spend their lives learning the genealogies, histories, and musical traditions that other communities have forgotten or never knew.',
  roles: ['Preserve and recite royal genealogies', 'Perform at naming ceremonies, weddings, funerals', 'Serve as diplomats and mediators between families', 'Master kora, balafon, and kontingo instruments', 'Recite the Sunjata Epic and other oral epics', 'Sing praises of patrons and warriors'],
  icons: [
    { name: 'Sona Jobarteh', note: 'First prominent female kora virtuoso from a griot family. International ambassador for Gambian music.' },
    { name: 'Jaliba Kuyateh', note: '"King of Kora" — the most beloved performer in Gambia, drawing thousands at live concerts.' },
    { name: 'Bai Konte', note: 'Legendary griot of the Konte family — one of the ancient kora-playing dynasties. His recordings preserve older kora traditions.' },
    { name: 'Foday Musa Suso', note: 'International kora master who collaborated with Herbie Hancock, bringing Gambian griot music to global jazz audiences.' },
    { name: 'Pa Bobo Jobarteh', note: 'Senior griot and custodian of ancient jaliya traditions. Keeper of royal genealogies in Gambia.' },
  ],
}

const FOLKLORE = [
  { title: 'The Sunjata Epic', icon: '👑', color: '#92400e', desc: 'The greatest oral epic of West Africa. Sunjata Keita was born unable to walk, mocked by rivals, and forced into exile with his mother. He overcame his disability, rallied allies, defeated the sorcerer-king Sumanguru Kante at the Battle of Kirina (c.1235), and founded the Mali Empire — the largest empire in medieval African history. The epic is preserved by Mandinka griots who recite it at ceremonies across Gambia and the region.' },
  { title: 'Ninki Nanka', icon: '🐉', color: '#166534', desc: 'The most feared creature in Gambian folklore. The Ninki Nanka is a river dragon said to live in the mangrove swamps of The Gambia River. Descriptions vary — sometimes a giant snake with a horse-like head, sometimes a dragon with scales that shine in darkness. It is said that to see the Ninki Nanka is to die within weeks. The creature is used to teach children to respect rivers and not venture into dangerous waters.' },
  { title: 'Trickster Tales', icon: '🐰', color: '#7c3aed', desc: 'Animal trickster stories — featuring the clever hare who outwits larger, stronger animals through cunning — are central to Gambian oral tradition. These stories parallel the Brer Rabbit tales of African America, thought to have been carried to the New World by enslaved Africans. The hare represents the intelligence of the marginalized over brute power.' },
  { title: 'The River Spirit (Mamiwata)', icon: '💧', color: '#0e7490', desc: 'Water spirits are central to Gambian spiritual belief across ethnic groups. Mamiwata (Mami Wata) is a water deity of extraordinary beauty who appears to fishermen and travellers near the Gambia River. She can bring wealth and good fortune or exact a terrible price. Shrines to water spirits are found throughout the country.' },
]

const LITERATURE = [
  { name: 'Lenrie Peters', dates: '1932–2009', icon: '📝', color: '#0e7490', note: 'Founder of modern Gambian literature. A surgeon and poet who wrote in English about African identity, colonialism, and modernity. His poetry collections Satellites (1967) and Katchikali (1971) placed Gambian literature on the world stage.' },
  { name: 'Ebou Dibba', dates: '1943–2010', icon: '📚', color: '#7c3aed', note: 'Novelist and playwright. His landmark novel Chaff on the Wind (1986) explored Gambian village life and cultural tensions. One of the first Gambian novelists to achieve international publication.' },
  { name: 'Tijan Sallah', dates: 'b. 1958', icon: '✍️', color: '#92400e', note: 'Poet, critic, and economist. Author of Kora Land (1989) and When Africa Was a Young Woman (1980). Sallah\'s poetry blends Gambian landscape and culture with contemporary African literary tradition. Also a World Bank economist.' },
  { name: 'Nana Grey-Johnson', dates: 'b. 1948', icon: '🌍', color: '#166534', note: 'One of the pioneering voices of Gambian letters. Short stories and poetry exploring Gambian cultural identity and the tensions of postcolonial life. A central figure in building literary institutions in The Gambia.' },
  { name: 'Badara Sanneh', dates: 'Contemporary', icon: '🖊️', color: '#be185d', note: 'Contemporary Gambian author building the next generation of local literature. Represents the emerging generation of Gambian writers publishing in the digital age.' },
]

const GAMES = [
  { name: 'Wari / Bao', icon: '🔵', color: '#0e7490', desc: 'A mancala board game played across The Gambia and West Africa. Two players distribute seeds or stones across hollowed-out holes carved in wood or stone. The goal is to capture the most seeds. Wari sharpens mental arithmetic and strategy — elders play for hours under mango trees while discussing community matters.' },
  { name: 'Borreh (Wrestling)', icon: '🤼', color: '#92400e', desc: 'Beyond formal tournaments, wrestling is also a children\'s game — boys grapple and practice from an early age, with no formal rules, in village compounds and open spaces. Early wrestling is how future champions are identified.' },
  { name: 'Dibini (Marbles)', icon: '⚪', color: '#7c3aed', desc: 'Marbles games played with hand-made clay balls or purchased glass marbles. Children draw circles in the dirt and flick marbles to win opponents\' pieces. A simple game requiring precision and spatial intelligence.' },
  { name: 'Ludu', icon: '🎲', color: '#166534', desc: 'Ludo (the board game) is extraordinarily popular in Gambia — played on cardboard boards, bottle caps as pieces, and homemade dice. Evening Ludu games are a social institution in Gambian homes and compounds.' },
  { name: 'Sòrò (Children\'s Circle Games)', icon: '⭕', color: '#be185d', desc: 'Traditional children\'s circle games combining singing, clapping, and movement. These games teach rhythm, coordination, social bonds, and oral tradition. Many songs have been passed unchanged through generations.' },
]

type TabId = 'overview' | 'ethnic' | 'languages' | 'music' | 'dances' | 'drumming' | 'food' | 'festivals' | 'masquerades' | 'marriage' | 'wrestling' | 'griots' | 'folklore' | 'literature' | 'games' | 'ambassadors' | 'quiz'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '🇬🇲' },
  { id: 'ethnic', label: 'Ethnic Groups', icon: '👥' },
  { id: 'languages', label: 'Languages', icon: '🗣️' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'dances', label: 'Dances', icon: '💃' },
  { id: 'drumming', label: 'Drumming', icon: '🥁' },
  { id: 'food', label: 'Food & Recipes', icon: '🍲' },
  { id: 'festivals', label: 'Festivals', icon: '🎉' },
  { id: 'masquerades', label: 'Masquerades', icon: '🎭' },
  { id: 'wrestling', label: 'Wrestling', icon: '🤼' },
  { id: 'griots', label: 'Griot Tradition', icon: '📜' },
  { id: 'folklore', label: 'Folklore', icon: '🐉' },
  { id: 'literature', label: 'Literature', icon: '📚' },
  { id: 'games', label: 'Local Games', icon: '🎮' },
  { id: 'quiz', label: 'Cultural Quiz', icon: '🧠' },
]

// ─── SHARED CARD ──────────────────────────────────────────────────────────────

function Card({ title, icon, color, children, tags }: { title: string; icon: string; color: string; children: React.ReactNode; tags?: string[] }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ height: 72, background: `linear-gradient(135deg, ${color}, ${color}cc)`, display: 'flex', alignItems: 'center', padding: '0 1.25rem', gap: 12 }}>
        <span style={{ fontSize: 32 }}>{icon}</span>
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{title}</div>
          {tags && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 3 }}>
              {tags.map(t => <span key={t} style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '1px 6px', borderRadius: 999, fontWeight: 600 }}>{t}</span>)}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '1rem 1.1rem', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function OverviewSection() {
  const stats = [
    { v: '8+', l: 'Ethnic Groups' },
    { v: '6', l: 'Major Languages' },
    { v: '45+', l: 'Cultural Assets' },
    { v: '2', l: 'UNESCO Heritage Items' },
    { v: '1.3M', l: 'People (2024 est.)' },
    { v: '10,689', l: 'km² — Smallest Mainland Africa' },
  ]

  return (
    <div>
      <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 800, color: DARK, margin: '0 0 0.75rem' }}>
          The Smiling Coast of Africa
        </h2>
        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 1rem' }}>
          The Gambia — the smallest country on mainland Africa — punches far above its size in cultural richness. Flanked on three sides by Senegal and with the Atlantic Ocean to the west, The Gambia is a narrow country built around the Gambia River. Its people represent a tapestry of West African civilisations: the Mali Empire&apos;s Mandinka heritage, the pastoral Fula, the trading Wolof, the spiritual Jola, and more — each bringing their music, language, food, masquerades, and wisdom.
        </p>
        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>
          This cultural hub maps over 45 distinct cultural assets — from the UNESCO-listed Kankurang masquerade to the national dish Domoda, from the extraordinary kora tradition to ancient proverbs still spoken daily. Navigate using the tabs below to explore every dimension of Gambian heritage.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12, marginBottom: '1.25rem' }}>
        {stats.map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 10, border: '1.5px solid #e5e7eb', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 900, color: G }}>{s.v}</div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Proverb Widget */}
      <CulturalProverbWidget />
    </div>
  )
}

function EthnicSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {ETHNIC_GROUPS.map(g => (
        <Card key={g.name} title={g.name} icon={g.icon} color={g.color} tags={[g.pct]}>
          <p style={{ margin: '0 0 0.75rem' }}>{g.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {g.traits.map(t => (
              <span key={t} style={{ fontSize: 11, background: '#f3f4f6', borderRadius: 6, padding: '3px 8px', color: '#374151', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

function LanguagesSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {LANGUAGES.map(l => (
        <Card key={l.name} title={l.name} icon={l.icon} color={G} tags={[l.role, l.speakers]}>
          <p style={{ margin: 0 }}>{l.desc}</p>
        </Card>
      ))}
    </div>
  )
}

function MusicSection() {
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 100%)`, borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1.25rem', color: '#fff' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: 15 }}>🎵 Griot Audio — Listen on YouTube</h3>
        <p style={{ margin: '0 0 1rem', fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Search these artists on YouTube or Spotify for authentic Gambian music:</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Sona Jobarteh', 'Jaliba Kuyateh', 'Bai Konte', 'Foday Musa Suso', 'Toumani Diabaté'].map(a => (
            <span key={a} style={{ background: GOLD, color: DARK, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>{a}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {MUSIC.map(m => (
          <Card key={m.name} title={m.name} icon={m.icon} color={m.color}>
            <p style={{ margin: 0 }}>{m.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function DancesSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {DANCES.map(d => (
        <Card key={d.name} title={d.name} icon={d.icon} color={d.color} tags={[d.origin]}>
          <p style={{ margin: 0 }}>{d.desc}</p>
        </Card>
      ))}
    </div>
  )
}

function DrummingSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
      {DRUMMING.map(d => (
        <Card key={d.name} title={d.name} icon={d.icon} color={d.color} tags={[d.people]}>
          <p style={{ margin: 0 }}>{d.desc}</p>
        </Card>
      ))}
    </div>
  )
}

function FestivalsSection() {
  const festivals = [
    { name: 'International Roots Homecoming Festival', dates: 'May 2026 (biennial)', location: 'Juffureh / Albreda', type: 'Heritage/Diaspora', icon: '🌍', color: '#7c3aed', desc: 'The most internationally significant Gambian cultural festival — celebrating the African diaspora\'s connection to The Gambia. Thousands of visitors of African descent travel from the US, UK, and the Caribbean. Features music, dance, storytelling, and boat trips to Kunta Kinteh Island (UNESCO World Heritage).' },
    { name: 'Kankurang Festival', dates: 'January (Janjanbureh)', location: 'Janjanbureh, CRR', type: 'Cultural/Heritage', icon: '🎭', color: '#b91c1c', desc: 'The annual celebration of the UNESCO-listed Kankurang masquerade in Janjanbureh (Georgetown). Features masquerade performances, traditional music, and cultural heritage events. The festival draws cultural scholars from across the world.' },
    { name: 'International Kora Festival', dates: 'January', location: 'Brikama', type: 'Music', icon: '🎵', color: '#92400e', desc: 'A celebration of the kora — bringing together master kora players from Gambia, Senegal, Guinea, and Mali. Brikama is the spiritual home of kora-making and kora-playing in The Gambia.' },
    { name: 'Banjul Demba Cultural Festival', dates: 'February', location: 'Banjul', type: 'Traditional', icon: '🪘', color: '#166534', desc: 'Traditional Gambian music, dance, and cuisine. Showcases Mandinka, Wolof, Fula, and Jola cultural traditions in the capital. A major annual event for cultural practitioners.' },
    { name: 'Independence Day', dates: '18 February', location: 'National', type: 'National', icon: '🇬🇲', color: G, desc: 'Celebrates The Gambia\'s independence from Britain on 18 February 1965. Military parade at Independence Drive in Banjul, flag-raising ceremony, cultural performances, and fireworks.' },
    { name: 'Koriteh (Eid al-Fitr)', dates: 'Post-Ramadan', location: 'National', type: 'Religious', icon: '🌙', color: '#1e3a5f', desc: 'The end of Ramadan — the most important religious celebration in The Gambia. Morning prayers at mosques, family feasts, new clothes, and visits to relatives. Public holiday. The streets of Banjul come alive with music and celebration.' },
    { name: 'Tobaski (Eid al-Adha)', dates: 'June (varies)', location: 'National', type: 'Religious', icon: '🐑', color: '#b45309', desc: 'Festival of sacrifice — the most spiritually significant Islamic holiday. Morning prayers, sacrifice of animals, sharing meat with neighbours and those in need. Every Gambian family participates regardless of economic means.' },
    { name: 'Kartong Cultural Festival', dates: 'Annual', location: 'Kartong Village', type: 'Community', icon: '🏖️', color: '#0e7490', desc: 'A beloved community festival in the coastal village of Kartong, featuring traditional music, dance, crafts, and wrestling. One of The Gambia\'s most intimate and authentic cultural celebrations.' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {festivals.map(f => (
        <Card key={f.name} title={f.name} icon={f.icon} color={f.color} tags={[f.dates, f.location]}>
          <p style={{ margin: 0 }}>{f.desc}</p>
        </Card>
      ))}
    </div>
  )
}

function MasqueradesSection() {
  return (
    <div>
      <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.25rem', fontSize: 13, color: '#7f1d1d' }}>
        <strong>Cultural Note:</strong> Some masquerade traditions are sacred and access-restricted. The information presented here is for cultural education. Photography or attendance at certain performances may require permission from community elders.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {MASQUERADES.map(m => (
          <Card key={m.name} title={m.name} icon={m.icon} color={m.color} tags={[m.people, m.heritage]}>
            <p style={{ margin: 0 }}>{m.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function WrestlingSection() {
  return (
    <div>
      <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: 40, marginBottom: '0.75rem' }}>🤼</div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: DARK, margin: '0 0 0.75rem' }}>{WRESTLING.name}</h3>
        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>{WRESTLING.desc}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
          <h4 style={{ fontSize: 13, fontWeight: 800, color: DARK, margin: '0 0 0.75rem' }}>⚔️ Rules of Borreh</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {WRESTLING.rules.map(r => <li key={r} style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>{r}</li>)}
          </ul>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
          <h4 style={{ fontSize: 13, fontWeight: 800, color: DARK, margin: '0 0 0.75rem' }}>🎵 Cultural Elements</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {WRESTLING.cultural.map(c => <li key={c} style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>{c}</li>)}
          </ul>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', padding: '1.25rem' }}>
          <h4 style={{ fontSize: 13, fontWeight: 800, color: DARK, margin: '0 0 0.75rem' }}>📍 Wrestling Hubs</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {WRESTLING.hubs.map(h => <li key={h} style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>{h}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

function GriotSection() {
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 100%)`, borderRadius: 14, padding: '1.5rem', marginBottom: '1.25rem', color: '#fff' }}>
        <div style={{ fontSize: 40, marginBottom: '0.5rem' }}>📜</div>
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 0.75rem' }}>The Griot Tradition — Jaliya</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: '0 0 1rem', color: 'rgba(255,255,255,0.85)' }}>{GRIOT.desc}</p>
        <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 0.5rem', color: GOLD }}>Roles of the Griot</h4>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {GRIOT.roles.map(r => <li key={r} style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>{r}</li>)}
        </ul>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: DARK, margin: '0 0 0.75rem' }}>Master Griots & Cultural Ambassadors</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {GRIOT.icons.map((g, i) => (
          <div key={g.name} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e7eb', padding: '1rem 1.1rem', display: 'flex', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${G}, #2A6B52)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
              {g.name[0]}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: DARK }}>{g.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, marginTop: 2 }}>{g.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FolkloreSection() {
  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <CulturalProverbWidget />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {FOLKLORE.map(f => (
          <Card key={f.title} title={f.title} icon={f.icon} color={f.color}>
            <p style={{ margin: 0 }}>{f.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

function LiteratureSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {LITERATURE.map(l => (
        <div key={l.name} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ height: 72, background: `linear-gradient(135deg, ${l.color}, ${l.color}cc)`, display: 'flex', alignItems: 'center', padding: '0 1.25rem', gap: 12 }}>
            <span style={{ fontSize: 30 }}>{l.icon}</span>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{l.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{l.dates}</div>
            </div>
          </div>
          <div style={{ padding: '1rem 1.1rem', fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{l.note}</div>
        </div>
      ))}
    </div>
  )
}

function GamesSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {GAMES.map(g => (
        <Card key={g.name} title={g.name} icon={g.icon} color={g.color}>
          <p style={{ margin: 0 }}>{g.desc}</p>
        </Card>
      ))}
    </div>
  )
}

function MarriageSection() {
  const practices = [
    { title: 'Family Negotiations', icon: '🤝', color: G, desc: 'Marriage begins long before the ceremony — with formal visits between families. The groom\'s family presents kola nuts as a symbol of intent. Elders negotiate the bride price (sadaq) — traditionally cattle, cash, or cloth — over several sessions. Community elders mediate and both families must agree before any ceremony proceeds.' },
    { title: 'Nikkah — Islamic Contract', icon: '🌙', color: '#1e3a5f', desc: 'As a majority-Muslim country, most Gambian marriages are formalised through the Nikkah — an Islamic marriage contract witnessed by an Imam, two male witnesses, and both families. The groom makes his mahr (gift) to the bride. The ceremony is brief but spiritually binding.' },
    { title: 'Traditional Bride Presentation', icon: '👰', color: '#be185d', desc: 'The bride is adorned by elder women of her family — dressed in the finest traditional clothing, adorned with gold jewellery, and her hands and feet decorated with henna. She is then formally presented to the groom\'s family in a ceremony of great beauty and ceremony.' },
    { title: 'Multi-Day Celebration', icon: '🎉', color: '#92400e', desc: 'Gambian weddings are multi-day events. The first day features the formal ceremony; subsequent days involve music, dancing, feasting, and communal celebration. Griots sing praises of both families. The community cooks enormous pots of Benachin and Domoda for everyone who attends.' },
    { title: 'Wrestling at Weddings', icon: '🤼', color: '#166534', desc: 'In many communities, traditional wrestling (Borreh) forms part of the wedding celebration — young men of both families compete, accompanied by drumming and griot praise-singing. It is both entertainment and a display of family honour.' },
    { title: 'Christian Ceremonies', icon: '✝️', color: '#0e7490', desc: 'The approximately 5% Christian Gambian population (predominantly Aku/Creole and Manjago communities) holds church weddings in addition to or instead of Islamic ceremonies. Many families practise both traditions, honouring both religious and cultural heritage.' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {practices.map(p => (
        <Card key={p.title} title={p.title} icon={p.icon} color={p.color}>
          <p style={{ margin: 0 }}>{p.desc}</p>
        </Card>
      ))}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function GambianCulturePage() {
  const [active, setActive] = useState<TabId>('overview')

  function renderSection() {
    switch (active) {
      case 'overview': return <OverviewSection />
      case 'ethnic': return <EthnicSection />
      case 'languages': return <LanguagesSection />
      case 'music': return <MusicSection />
      case 'dances': return <DancesSection />
      case 'drumming': return <DrummingSection />
      case 'food': return <GambianFoodRecipes />
      case 'festivals': return <FestivalsSection />
      case 'masquerades': return <MasqueradesSection />
      case 'marriage': return <MarriageSection />
      case 'wrestling': return <WrestlingSection />
      case 'griots': return <GriotSection />
      case 'folklore': return <FolkloreSection />
      case 'literature': return <LiteratureSection />
      case 'games': return <GamesSection />
      case 'ambassadors': return <GriotSection />
      case 'quiz': return <CulturalQuiz />
      default: return null
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F5F2F0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Hero */}
      <header style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 55%, #2A6B52 100%)`, padding: '2.5rem 1.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Gambian flag stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, display: 'flex' }}>
          <div style={{ flex: 2, background: '#3A7D44' }} />
          <div style={{ flex: 1, background: '#fff' }} />
          <div style={{ flex: 1, background: '#E63946' }} />
          <div style={{ flex: 1, background: '#fff' }} />
          <div style={{ flex: 2, background: '#3A7D44' }} />
        </div>
        {/* Decorative background text */}
        <div style={{ position: 'absolute', bottom: -20, right: -10, fontSize: 120, opacity: 0.04, lineHeight: 1, userSelect: 'none' }}>🇬🇲</div>

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/discover" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>
            ← Discover Gambia
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 56 }}>🇬🇲</div>
            <div>
              <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 900, margin: '0 0 0.4rem', lineHeight: 1.1 }}>
                Gambian Cultural Heritage Hub
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 'clamp(13px, 2vw, 15px)', maxWidth: 560 }}>
                45+ cultural assets mapped — ethnic groups, music, dances, masquerades, food, folklore, literature and more. The Smiling Coast of Africa, digitised.
              </p>
            </div>
          </div>
          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {[['8+', 'Ethnic Groups'], ['2', 'UNESCO Heritage'], ['15', 'Categories'], ['45+', 'Cultural Assets']].map(([v, l]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 14px', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: GOLD }}>{v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Tab Bar */}
      <div style={{ background: '#fff', borderBottom: '1.5px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 40, overflowX: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', padding: '0 1rem' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: active === t.id ? `3px solid ${G}` : '3px solid transparent',
                color: active === t.id ? G : '#6b7280',
                fontWeight: active === t.id ? 800 : 600,
                fontSize: 12,
                padding: '14px 12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
          {/* Marriage tab not in TABS array but still navigable */}
          <button
            onClick={() => setActive('marriage')}
            style={{
              background: 'none', border: 'none',
              borderBottom: active === 'marriage' ? `3px solid ${G}` : '3px solid transparent',
              color: active === 'marriage' ? G : '#6b7280',
              fontWeight: active === 'marriage' ? 800 : 600,
              fontSize: 12, padding: '14px 12px', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            💍 Marriage
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>

        {/* Section Header */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 800, color: DARK, margin: 0 }}>
              {TABS.find(t => t.id === active)?.icon || '💍'}{' '}
              {active === 'marriage' ? 'Marriage Traditions'
                : TABS.find(t => t.id === active)?.label || active}
            </h2>
          </div>
          <Link href="/festivals" style={{ fontSize: 12, color: G, fontWeight: 700, textDecoration: 'none', background: '#f0fdf4', padding: '6px 12px', borderRadius: 8, border: `1px solid ${G}` }}>
            🎉 Festival Calendar →
          </Link>
        </div>

        {renderSection()}
      </div>

      {/* Footer CTA */}
      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, ${G} 100%)`, padding: '2rem 1.5rem', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 36, marginBottom: '0.5rem' }}>🌍</div>
          <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 800, margin: '0 0 0.5rem' }}>
            Explore More of Gambia on FORTIS OS
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '0 0 1.25rem' }}>
            Discover tourism sites, legal resources, agriculture data, financial institutions and more.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/tourism/discover" style={{ background: GOLD, color: DARK, borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
              🗺️ Tourism Map
            </Link>
            <Link href="/festivals" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 800, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              🎉 Festivals 2026
            </Link>
            <Link href="/ujris/gambia" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 800, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              ⚖️ UJRIS Legal
            </Link>
          </div>
        </div>
      </div>

    </main>
  )
}
