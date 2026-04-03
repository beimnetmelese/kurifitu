export type PageKey =
  | 'overview'
  | 'workforce'
  | 'maintenance'
  | 'inventory'
  | 'twin'
  | 'strategy'
  | 'feedbackDashboard'
  | 'feedbackStream'
  | 'analytics'
  | 'faqTrainer'
  | 'analyticsOverview'
  | 'analyticsDeep'
  | 'guestPersonalization'
  | 'dynamicPricing'
  | 'customerSegments'

export type ScenarioKey =
  | 'Calm Morning'
  | 'Weekend Rush'
  | 'Rain Alert'
  | 'VIP Arrival'
  | 'Event Night'

export type StaffStatus = 'Active' | 'Idle' | 'Assigned'
export type AreaKey = 'Pool' | 'Restaurant' | 'Lobby' | 'Spa' | 'Bar'
export type DeviceStatus = 'Healthy' | 'Warning' | 'Critical'

export type StaffMember = {
  id: number
  name: string
  role: string
  area: AreaKey
  status: StaffStatus
  energy: number
  skill: number
  guestScore: number
}

export type MaintenanceRoom = {
  room: string
  ac: DeviceStatus
  water: DeviceStatus
  power: DeviceStatus
  health: number
  priority: number
  impact: string
  note: string
}

export type InventoryItem = {
  name: string
  category: 'Food' | 'Drink' | 'Supply'
  stock: number
  demand: number
  margin: number
  risk: 'Low' | 'Medium' | 'High'
  trend: number[]
  suggestion: string
}

export type TwinZone = {
  name: 'Pool' | 'Rooms' | 'Restaurant' | 'Spa' | 'Lobby'
  activity: number
  flow: number
}

export type DecisionNote = {
  title: string
  detail: string
  tone: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose'
}

export type ScenarioPreset = {
  summary: string
  staffingBias: number
  inventoryBias: number
  maintenanceBias: number
  activityBias: number
  weather: string
}

export const pageTabs: { key: PageKey; label: string; detail: string }[] = [
  { key: 'overview', label: 'Command Center', detail: 'Real-time resort brain' },
  { key: 'workforce', label: 'Staff Engine', detail: 'Burnout-safe scheduling' },
  { key: 'maintenance', label: 'Maintenance', detail: 'Predict before failure' },
  { key: 'inventory', label: 'Inventory', detail: 'Predict demand, stop waste' },
  { key: 'twin', label: 'Digital Twin', detail: 'Living resort simulation' },
  { key: 'strategy', label: 'Strategy Lab', detail: 'What-if decision engine' },
  { key: 'feedbackDashboard', label: 'Feedback Dashboard', detail: 'Executive sentiment summary' },
  { key: 'feedbackStream', label: 'Feedback Stream', detail: 'Live voice of customer feed' },
  { key: 'analytics', label: 'Analytics Lab', detail: 'Cross-sector sentiment analytics' },
  { key: 'faqTrainer', label: 'FAQ Trainer', detail: 'Train answer suggestions for demos' },
  { key: 'analyticsOverview', label: 'Revenue Dashboard', detail: 'Revenue and demand overview' },
  { key: 'analyticsDeep', label: 'Revenue Analytics', detail: 'Pricing and occupancy impact analysis' },
  { key: 'guestPersonalization', label: 'Guest Personalization', detail: 'Targeted recommendations per guest' },
  { key: 'dynamicPricing', label: 'Dynamic Pricing', detail: 'Room-rate optimization recommendations' },
  { key: 'customerSegments', label: 'Customer Segments', detail: 'Segment strategy and value insights' },
]

export const scenarios: ScenarioKey[] = [
  'Calm Morning',
  'Weekend Rush',
  'Rain Alert',
  'VIP Arrival',
  'Event Night',
]

export const scenarioPresets: Record<ScenarioKey, ScenarioPreset> = {
  'Calm Morning': {
    summary: 'Balanced morning flow with light guest movement and soft demand.',
    staffingBias: 1,
    inventoryBias: 1,
    maintenanceBias: 1,
    activityBias: 1,
    weather: 'Clear skies',
  },
  'Weekend Rush': {
    summary: 'Heavy pool traffic, higher restaurant demand, and tighter staff coverage.',
    staffingBias: 6,
    inventoryBias: 7,
    maintenanceBias: 2,
    activityBias: 7,
    weather: 'Hot and sunny',
  },
  'Rain Alert': {
    summary: 'Guests move indoors, spa traffic spikes, and the pool cools down.',
    staffingBias: 4,
    inventoryBias: 4,
    maintenanceBias: 3,
    activityBias: 3,
    weather: 'Rain and wind',
  },
  'VIP Arrival': {
    summary: 'High service expectations, premium routing, and concierge priority.',
    staffingBias: 5,
    inventoryBias: 5,
    maintenanceBias: 2,
    activityBias: 6,
    weather: 'Perfect arrival window',
  },
  'Event Night': {
    summary: 'Late-night surge for bar, kitchen, transport, and security operations.',
    staffingBias: 7,
    inventoryBias: 8,
    maintenanceBias: 3,
    activityBias: 8,
    weather: 'Warm evening',
  },
}

export const initialStaff: StaffMember[] = [
  { id: 1, name: 'Maya Lopez', role: 'Lifeguard Lead', area: 'Pool', status: 'Active', energy: 88, skill: 92, guestScore: 89 },
  { id: 2, name: 'Arjun Patel', role: 'Concierge', area: 'Lobby', status: 'Assigned', energy: 80, skill: 96, guestScore: 94 },
  { id: 3, name: 'Selene Park', role: 'Host', area: 'Restaurant', status: 'Active', energy: 74, skill: 85, guestScore: 90 },
  { id: 4, name: 'Jonah Price', role: 'Spa Therapist', area: 'Spa', status: 'Idle', energy: 91, skill: 86, guestScore: 87 },
  { id: 5, name: 'Nia Carter', role: 'Server', area: 'Restaurant', status: 'Assigned', energy: 69, skill: 80, guestScore: 82 },
  { id: 6, name: 'Dante Reed', role: 'Pool Attendant', area: 'Pool', status: 'Active', energy: 83, skill: 78, guestScore: 84 },
  { id: 7, name: 'Priya Shah', role: 'Guest Relations', area: 'Lobby', status: 'Idle', energy: 77, skill: 88, guestScore: 93 },
  { id: 8, name: 'Levi Stone', role: 'Bar Captain', area: 'Bar', status: 'Assigned', energy: 66, skill: 81, guestScore: 86 },
]

export const initialRooms: MaintenanceRoom[] = [
  { room: '101', ac: 'Healthy', water: 'Healthy', power: 'Healthy', health: 96, priority: 12, impact: 'Low guest impact', note: 'Stable sensors and low vibration.' },
  { room: '102', ac: 'Healthy', water: 'Warning', power: 'Healthy', health: 84, priority: 28, impact: 'Medium guest impact', note: 'Water pressure trending downward.' },
  { room: '203', ac: 'Warning', water: 'Healthy', power: 'Healthy', health: 71, priority: 55, impact: 'High guest impact', note: 'AC load spikes around 3 PM.' },
  { room: '204', ac: 'Critical', water: 'Warning', power: 'Healthy', health: 49, priority: 91, impact: 'Critical guest impact', note: 'AC likely to fail within 48 hours.' },
  { room: '301', ac: 'Healthy', water: 'Healthy', power: 'Warning', health: 88, priority: 34, impact: 'Medium guest impact', note: 'Power draw is above the normal band.' },
  { room: '402', ac: 'Warning', water: 'Healthy', power: 'Critical', health: 57, priority: 84, impact: 'High guest impact', note: 'Voltage irregularity detected overnight.' },
]

export const initialInventory: InventoryItem[] = [
  { name: 'Fresh Juice', category: 'Drink', stock: 61, demand: 72, margin: 65, risk: 'High', trend: [48, 52, 56, 60, 66, 72], suggestion: 'Add a breakfast juice bundle.' },
  { name: 'Tomatoes', category: 'Food', stock: 89, demand: 42, margin: 88, risk: 'Low', trend: [70, 66, 63, 58, 50, 42], suggestion: 'Promote pasta special to reduce excess.' },
  { name: 'Towels', category: 'Supply', stock: 68, demand: 64, margin: 54, risk: 'Medium', trend: [55, 57, 58, 60, 62, 64], suggestion: 'Move a replenishment cycle forward.' },
  { name: 'Seafood', category: 'Food', stock: 46, demand: 68, margin: 91, risk: 'High', trend: [42, 48, 53, 58, 63, 68], suggestion: 'Lock in supplier delivery before dinner.' },
  { name: 'Sparkling Water', category: 'Drink', stock: 83, demand: 58, margin: 47, risk: 'Low', trend: [44, 47, 50, 52, 55, 58], suggestion: 'Keep current reorder timing.' },
  { name: 'Amenities Kit', category: 'Supply', stock: 74, demand: 69, margin: 73, risk: 'Medium', trend: [60, 61, 63, 65, 67, 69], suggestion: 'Pair with VIP arrivals this week.' },
]

export const initialZones: TwinZone[] = [
  { name: 'Pool', activity: 54, flow: 64 },
  { name: 'Rooms', activity: 62, flow: 56 },
  { name: 'Restaurant', activity: 71, flow: 78 },
  { name: 'Spa', activity: 46, flow: 42 },
  { name: 'Lobby', activity: 38, flow: 51 },
]

export const initialDecisions: DecisionNote[] = [
  { title: 'Flow reroute executed', detail: 'Shifted 2 staff from lobby to pool for the next 20 minutes.', tone: 'cyan' },
  { title: 'Demand forecast sharpened', detail: 'Dinner load predicted to peak 18% above baseline.', tone: 'violet' },
  { title: 'Room 204 escalated', detail: 'Maintenance priority jumped after AC vibration anomaly.', tone: 'rose' },
  { title: 'Inventory safety buffer raised', detail: 'Juice and seafood thresholds moved up before evening.', tone: 'amber' },
  { title: 'Burnout guard active', detail: 'Staff energy dips below threshold triggered recovery scheduling.', tone: 'emerald' },
]

export const scenarioStory: Record<ScenarioKey, string[]> = {
  'Calm Morning': [
    'OpsMind stabilizes the floor plan and watches for early guest movement.',
    'Staff are kept balanced to avoid unnecessary burnout.',
    'Inventory stays conservative while the resort wakes up.',
  ],
  'Weekend Rush': [
    'Pool traffic climbs fast and the restaurant queue becomes the main pressure point.',
    'Staff are pulled into the highest impact zones before congestion forms.',
    'Food and drink demand starts to surge across premium items.',
  ],
  'Rain Alert': [
    'Outdoor flow drops and indoor amenities become the new priority.',
    'Spa and lobby staffing are increased to absorb the shift.',
    'Pool demand cools while warm food and beverages rise.',
  ],
  'VIP Arrival': [
    'The concierge layer activates premium routing and service protection.',
    'Best-rated staff are automatically reserved for the arriving guest profile.',
    'Maintenance gets a quiet pass for visible issues in the VIP route.',
  ],
  'Event Night': [
    'Late-night operations stretch bar, kitchen, transport, and security.',
    'Inventory demand moves aggressively toward drinks and fast-moving food.',
    'A stronger maintenance buffer is kept in case equipment overheats.',
  ],
}

export const initialHighlights = [
  { label: 'Active guests', value: 286, delta: '+18 from baseline' },
  { label: 'Staff in motion', value: 19, delta: 'AI redistributed 4 roles' },
  { label: 'Assets monitored', value: 24, delta: '3 devices need attention' },
  { label: 'Projected margin', value: 41, delta: 'Inventory waste reduced by 12%' },
]

export function scenarioScore(seed: number, bias: number) {
  return Math.max(24, Math.min(98, seed + bias * 3))
}
