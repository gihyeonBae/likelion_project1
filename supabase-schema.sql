create table if not exists public.categories (
  id text primary key,
  name_ko text not null,
  name_en text not null,
  description text not null default '',
  sort_order integer not null default 1,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.menus (
  id text primary key,
  name_ko text not null,
  name_en text not null,
  category_id text not null references public.categories(id) on update cascade,
  description text not null default '',
  price integer not null default 0,
  image_url text not null default '',
  image_tone text not null default 'coffee',
  tags text[] not null default '{}',
  options jsonb not null default '{}'::jsonb,
  status text not null default 'on-sale',
  is_recommended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.orders (
  id text primary key,
  items jsonb not null default '[]'::jsonb,
  pickup_name text not null,
  pickup_phone text not null,
  pickup_time text not null,
  request_message text not null default '',
  total_price integer not null default 0,
  status text not null default 'received',
  payment_status text not null default 'before-payment',
  channel text not null default 'online',
  admin_memo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  canceled_at timestamptz
);

create table if not exists public.customers (
  id text primary key,
  name text not null,
  email text not null unique,
  password text not null,
  phone text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  status_updated_at timestamptz,
  withdrawn_at timestamptz
);

alter table public.categories enable row level security;
alter table public.menus enable row level security;
alter table public.orders enable row level security;
alter table public.customers enable row level security;

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
  on public.categories for select
  using (true);

drop policy if exists "Public read menus" on public.menus;
create policy "Public read menus"
  on public.menus for select
  using (true);

drop policy if exists "Public read orders" on public.orders;
create policy "Public read orders"
  on public.orders for select
  using (true);

drop policy if exists "Public read customers" on public.customers;
create policy "Public read customers"
  on public.customers for select
  using (true);

drop policy if exists "Public write categories" on public.categories;
create policy "Public write categories"
  on public.categories for all
  using (true)
  with check (true);

drop policy if exists "Public write menus" on public.menus;
create policy "Public write menus"
  on public.menus for all
  using (true)
  with check (true);

drop policy if exists "Public write orders" on public.orders;
create policy "Public write orders"
  on public.orders for all
  using (true)
  with check (true);

drop policy if exists "Public write customers" on public.customers;
create policy "Public write customers"
  on public.customers for all
  using (true)
  with check (true);

insert into public.categories (id, name_ko, name_en, description, sort_order, is_visible)
values
  ('coffee', '커피', 'Coffee', '에스프레소 기반 커피와 콜드브루', 1, true),
  ('non-coffee', '논커피 음료', 'Non Coffee', '말차, 초코, 밀크티, 에이드', 2, true),
  ('dessert', '디저트', 'Dessert', '케이크, 쿠키, 구움과자', 3, true),
  ('bakery', '베이커리', 'Bakery', '크루아상, 소금빵, 스콘, 베이글', 4, true),
  ('season', '시즌 메뉴', 'Seasonal', '계절 한정 음료와 디저트', 5, true)
on conflict (id) do update set
  name_ko = excluded.name_ko,
  name_en = excluded.name_en,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_visible = excluded.is_visible,
  updated_at = now();

insert into public.menus (
  id,
  name_ko,
  name_en,
  category_id,
  description,
  price,
  image_url,
  image_tone,
  tags,
  options,
  status,
  is_recommended
)
values
  (
    'menu-001',
    '아메리카노',
    'Americano',
    'coffee',
    '깔끔한 산미와 고소한 향이 균형 잡힌 기본 커피',
    4500,
    './assets/images/menu/americano.jpg',
    'coffee',
    array['coffee', 'classic'],
    '{"temperature":["hot","ice"],"size":["regular","large"],"extraShot":true,"syrup":false}'::jsonb,
    'on-sale',
    true
  ),
  (
    'menu-002',
    '바닐라 라떼',
    'Vanilla Latte',
    'coffee',
    '부드러운 우유와 바닐라 향이 어우러진 달콤한 라떼',
    5200,
    './assets/images/menu/vanilla-latte.jpg',
    'latte',
    array['best', 'sweet'],
    '{"temperature":["hot","ice"],"size":["regular","large"],"extraShot":true,"syrup":true}'::jsonb,
    'on-sale',
    true
  ),
  (
    'menu-003',
    '말차 라떼',
    'Matcha Latte',
    'non-coffee',
    '진한 말차와 우유의 고소함을 살린 논커피 음료',
    5800,
    './assets/images/menu/matcha-latte.jpg',
    'matcha',
    array['non-coffee', 'green'],
    '{"temperature":["hot","ice"],"size":["regular","large"],"extraShot":false,"syrup":true}'::jsonb,
    'on-sale',
    true
  ),
  (
    'menu-004',
    '레몬 에이드',
    'Lemon Ade',
    'non-coffee',
    '상큼한 레몬과 탄산감이 시원하게 살아있는 음료',
    5600,
    './assets/images/menu/lemon-ade.jpg',
    'ade',
    array['ice', 'fresh'],
    '{"temperature":["ice"],"size":["regular","large"],"extraShot":false,"syrup":true}'::jsonb,
    'on-sale',
    false
  ),
  (
    'menu-005',
    '치즈케이크',
    'Cheese Cake',
    'dessert',
    '진한 크림치즈 풍미가 있는 클래식 디저트',
    6800,
    './assets/images/menu/cheese-cake.jpg',
    'dessert',
    array['dessert', 'cake'],
    '{"takeout":true}'::jsonb,
    'on-sale',
    true
  ),
  (
    'menu-006',
    '소금빵',
    'Salt Bread',
    'bakery',
    '짭조름한 버터 풍미가 살아있는 베이커리 메뉴',
    3800,
    './assets/images/menu/salt-bread.jpg',
    'bakery',
    array['bakery', 'butter'],
    '{"takeout":true}'::jsonb,
    'on-sale',
    false
  ),
  (
    'menu-007',
    '시즌 피치 아이스티',
    'Season Peach Iced Tea',
    'season',
    '복숭아 향과 홍차의 산뜻함을 담은 시즌 한정 메뉴',
    6100,
    './assets/images/menu/peach-iced-tea.jpg',
    'season',
    array['season', 'limited'],
    '{"temperature":["ice"],"size":["regular","large"],"extraShot":false,"syrup":true}'::jsonb,
    'on-sale',
    false
  ),
  (
    'menu-008',
    '콜드브루',
    'Cold Brew',
    'coffee',
    '천천히 추출해 부드럽고 산뜻한 아이스 커피',
    5000,
    './assets/images/menu/cold-brew.jpg',
    'coffee',
    array['ice', 'smooth'],
    '{"temperature":["ice"],"size":["regular","large"],"extraShot":false,"syrup":false}'::jsonb,
    'on-sale',
    false
  ),
  (
    'menu-009',
    '티라미수',
    'Tiramisu',
    'dessert',
    '커피 향과 마스카포네 크림이 어우러진 디저트',
    7200,
    './assets/images/menu/tiramisu.jpg',
    'dessert',
    array['dessert', 'coffee'],
    '{"takeout":true}'::jsonb,
    'sold-out',
    false
  )
on conflict (id) do update set
  name_ko = excluded.name_ko,
  name_en = excluded.name_en,
  category_id = excluded.category_id,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  image_tone = excluded.image_tone,
  tags = excluded.tags,
  options = excluded.options,
  status = excluded.status,
  is_recommended = excluded.is_recommended,
  updated_at = now();
