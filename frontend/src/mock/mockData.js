// Central mock data for AI Employee dashboard clone

export const stats = [
  { label: 'REVENUE', value: '$4,820', hint: '+12% vs last week', icon: 'DollarSign' },
  { label: 'ORDERS', value: '37', hint: '7 awaiting fulfilment', icon: 'Mail' },
  { label: 'VISITORS', value: '1,240', hint: 'past 7 days', icon: 'Users' },
  { label: 'CONVERSION', value: '2.98%', hint: '+0.3% improvement', icon: 'LineChart' },
];

export const weeklySales = [
  { day: 'Mon', v: 520 },
  { day: 'Tue', v: 620 },
  { day: 'Wed', v: 495 },
  { day: 'Thu', v: 720 },
  { day: 'Fri', v: 880 },
  { day: 'Sat', v: 920 },
  { day: 'Sun', v: 795 },
];

export const aiStatus = [
  { tag: 'Listing', text: 'Magic listing from photo', sub: 'Indian Hand-Carved Wooden Printing B…' },
  { tag: 'Listing', text: 'Magic listing from photo', sub: 'Batik Floral Cotton Fabric' },
  { tag: 'Listing', text: 'Magic listing from photo', sub: 'Heirloom Floral Batik Fabric' },
  { tag: 'Listing', text: 'Completed a task', sub: 'make a listing' },
  { tag: 'Analytics', text: 'Generated evening report', sub: '' },
];

export const pendingWork = [
  { title: 'Restock carved teak block set (low stock)', level: 'HIGH' },
  { title: 'Reply to pending customer messages', level: 'HIGH' },
  { title: 'Create Instagram post for new kaftan', level: 'MEDIUM' },
  { title: 'Research Pinterest keywords for summer collection', level: 'HIGH' },
];

export const inventoryAlerts = [
  { name: 'Carved Teak Wood Printing Block Set', left: 4 },
  { name: "Women's Block Print Cotton Kaftan", left: 3 },
  { name: 'Sanganeri Block Print Table Runner', left: 2 },
  { name: 'Indigo Cotton Fabric (per meter)', left: 0 },
];

export const trendingKeywords = [
  'hand block print', 'indigo cotton fabric', 'block print dress',
  'artisan cushion cover', 'wooden printing block', 'handmade bedsheet',
];

export const products = [
  { id: 'p1', category: 'WOODEN BLOCKS', name: 'Indian Hand-Carved Wooden Printing Blocks', desc: 'Hand-Carved Indian Wooden Textile Printing Blocks | Traditional Rajasthani Stamp | Block Printing Art', price: 18, stock: 50, low: false },
  { id: 'p2', category: 'FABRIC', name: 'Batik Floral Cotton Fabric', desc: 'Handcrafted Batik Cotton Fabric | Antique Botanical Print | Natural Cream & Mocha Brown | Artisan Textile', price: 28, stock: 15, low: false },
  { id: 'p3', category: 'FABRIC', name: 'Heirloom Floral Batik Fabric', desc: 'Handcrafted Batik Cotton Fabric | Antique Floral Botanical Print | Natural Cream & Earthy Brown | Heritage Textile', price: 38, stock: 15, low: false },
  { id: 'p4', category: 'FABRIC', name: 'Sanganeri Indigo Yardage', desc: 'Sanganeri hand block, azo-free dyes, 44" width', price: 24, stock: 0, low: true },
  { id: 'p5', category: 'FABRIC', name: 'Ajrakh Cotton Sample', desc: 'Kutchi Ajrakh, natural dye, 1m sample', price: 49, stock: 10, low: false },
  { id: 'p6', category: 'HOME FURNISHING', name: 'Sanganeri Block Print Table Runner', desc: '72 inch, cotton', price: 28, stock: 2, low: true },
  { id: 'p7', category: 'FABRIC', name: 'Hand Block Printed Fabric (per meter)', desc: 'Pure cotton, natural dyes', price: 14, stock: 120, low: false },
  { id: 'p8', category: 'HOME FURNISHING', name: 'Floral Block Print Cushion Cover', desc: '16x16 inch, set available', price: 22, stock: 40, low: false },
  { id: 'p9', category: "WOMEN'S CLOTHING", name: "Women's Block Print Cotton Kaftan", desc: 'Free size, breathable cotton', price: 58, stock: 3, low: true },
  { id: 'p10', category: 'WOODEN BLOCKS', name: 'Carved Teak Wood Printing Block Set', desc: 'Set of 6 traditional motifs', price: 45, stock: 4, low: true },
  { id: 'p11', category: 'HOME FURNISHING', name: 'Indigo Block Print Cotton Bedsheet', desc: 'Double bed, 100% cotton, hand block printed', price: 79, stock: 12, low: false },
];

export const drafts = [
  { id: 'd1', title: 'Indian Hand-Carved Wooden Printing Blocks', status: 'Ready for Etsy', updated: '2h ago' },
  { id: 'd2', title: 'Batik Floral Cotton Fabric', status: 'Draft', updated: '5h ago' },
  { id: 'd3', title: 'Heirloom Floral Batik Fabric', status: 'Awaiting review', updated: 'yesterday' },
  { id: 'd4', title: 'Sanganeri Block Print Table Runner', status: 'Ready for Etsy', updated: '2 days ago' },
];

export const tasks = [
  { id: 't1', title: 'Restock carved teak block set (low stock)', assignee: 'Inventory Manager', due: 'Today', level: 'HIGH', done: false },
  { id: 't2', title: 'Reply to pending customer messages', assignee: 'Customer Support', due: 'Today', level: 'HIGH', done: false },
  { id: 't3', title: 'Create Instagram post for new kaftan', assignee: 'Graphic Designer', due: 'Tomorrow', level: 'MEDIUM', done: false },
  { id: 't4', title: 'Research Pinterest keywords for summer collection', assignee: 'Research Agent', due: 'Fri', level: 'HIGH', done: false },
  { id: 't5', title: 'Draft newsletter — new arrivals', assignee: 'Marketing Expert', due: 'Fri', level: 'MEDIUM', done: false },
  { id: 't6', title: 'Approve last week evening reports', assignee: 'CEO Agent', due: 'Today', level: 'LOW', done: true },
  { id: 't7', title: 'Verify Etsy shipping profiles', assignee: 'Listing Expert', due: 'Mon', level: 'LOW', done: true },
];

export const autopilotRules = [
  { id: 'a1', name: 'Auto-restock at 5 units', enabled: true, desc: 'When stock < 5, draft a purchase order for review.' },
  { id: 'a2', name: 'Reply within 15 minutes', enabled: true, desc: 'Customer Support drafts a reply and pings you to approve.' },
  { id: 'a3', name: 'Weekly evening report', enabled: true, desc: 'Every day at 7pm, summarise sales, stock, tasks.' },
  { id: 'a4', name: 'Auto-publish Etsy drafts', enabled: false, desc: 'Publish approved drafts to Etsy on Thursday 10am.' },
  { id: 'a5', name: 'Instagram post twice a week', enabled: false, desc: 'Graphic Designer prepares posts Tue and Fri.' },
];

export const integrations = [
  { name: 'Etsy', desc: 'Publish listings, sync orders & inventory.', connected: true, initial: 'E' },
  { name: 'Shopify', desc: 'Second-channel sales sync.', connected: false, initial: 'S' },
  { name: 'Instagram', desc: 'Publish reels, posts, story replies.', connected: true, initial: 'I' },
  { name: 'Pinterest', desc: 'Keyword research + pin scheduling.', connected: true, initial: 'P' },
  { name: 'Gmail', desc: 'Customer support inbox triage.', connected: false, initial: 'G' },
  { name: 'Google Analytics', desc: 'Traffic & conversion reporting.', connected: true, initial: 'A' },
  { name: 'Stripe', desc: 'Payments and payout reconciliation.', connected: false, initial: 'S' },
  { name: 'Slack', desc: 'Get pings when a task needs approval.', connected: true, initial: 'K' },
];

export const memoryNotes = [
  { tag: 'Brand voice', text: 'Warm, artisan, story-first. Never salesy. Prefer "hand-carved" over "hand made".' },
  { tag: 'Pricing rule', text: 'Fabric priced per meter, minimum 1m. Round to nearest whole dollar.' },
  { tag: 'Shipping', text: 'Free shipping over $75 in US. India ships next business day.' },
  { tag: 'Photography', text: 'Always shoot on natural cream linen background, top-down when possible.' },
  { tag: 'Do not use', text: 'Do not use "cheap", "discount", "clearance" in listings.' },
];

export const agents = {
  ceo: { name: 'CEO Agent', role: 'Sets weekly priorities, briefs your team.', tone: 'Strategic', last: 'Drafted Q3 plan and this week priorities.' },
  seo: { name: 'SEO Expert', role: 'Finds keywords, writes titles and tags.', tone: 'Analytical', last: 'Reviewed 32 keywords for summer collection.' },
  listing: { name: 'Listing Expert', role: 'Turns photos into ready-to-publish Etsy listings.', tone: 'Craft-first', last: 'Prepared 3 listings, waiting your approval.' },
  designer: { name: 'Graphic Designer', role: 'Prepares posts, banners and lookbook layouts.', tone: 'Visual', last: 'Drafted 2 Instagram posts for the kaftan drop.' },
  marketing: { name: 'Marketing Expert', role: 'Runs newsletters and campaign calendars.', tone: 'Story-led', last: 'Scheduled the "Monsoon Blues" newsletter.' },
  support: { name: 'Customer Support', role: 'Replies to messages, refunds and returns.', tone: 'Warm', last: 'Drafted 6 replies, 2 need a human touch.' },
  research: { name: 'Research Agent', role: 'Trends, competitors, moodboards.', tone: 'Curious', last: 'Found 4 rising Pinterest boards to mirror.' },
  sales: { name: 'Sales Agent', role: 'Follows abandoned carts, wholesale outreach.', tone: 'Persistent', last: 'Sent 12 follow-ups, 3 replies received.' },
  analytics: { name: 'Analytics Agent', role: 'Reads dashboards, flags what changed.', tone: 'Direct', last: 'Conversion up 0.3% — table runners driving it.' },
  inventory: { name: 'Inventory Manager', role: 'Watches stock, drafts purchase orders.', tone: 'Precise', last: '4 items low, 1 out of stock.' },
  task: { name: 'Task Manager', role: 'Keeps the team pointed at the right thing.', tone: 'Calm', last: '9 tasks in flight, 2 blocked on your approval.' },
};

export const notifications = [
  { id: 'n1', title: '2 listings ready for your approval', time: 'just now' },
  { id: 'n2', title: 'Carved teak block set is low stock (4 left)', time: '12m ago' },
];
