/**
 * 100 forum personas. Distributed across archetypes so conversations feel real.
 * daysSinceJoin controls how long ago each "joined" (spread 5-180 days ago).
 *
 * Rough distribution:
 *  - Veterans (big stacks, terse advice): 8
 *  - Mods (helpful tone, seeded MOD role): 2
 *  - New-to-peptides: 18
 *  - Protocol builders: 14
 *  - Lab/bloodwork nerds: 8
 *  - GLP-1 cohort: 12
 *  - Recovery/injury: 10
 *  - Cognitive/nootropics: 6
 *  - Sleep/longevity: 7
 *  - Skeptics (push back): 4
 *  - Lurkers (low post count, occasional): 11
 */

export interface SeedUserStackItem {
  compound: string;
  dose?: string;
  frequency?: string;
  route?: string;
  notes?: string;
}
export interface SeedUser {
  username: string;
  name?: string;
  bio?: string;
  location?: string;
  role?: "MEMBER" | "MODERATOR" | "ADMIN";
  signature?: string;
  daysSinceJoin: number;
  stack?: { title?: string; items: SeedUserStackItem[] };
}

export const USERS: SeedUser[] = [
  // ─── Moderators (2) ────────────────────────────────────────────────
  {
    username: "cardinal_rule",
    name: "Marcus",
    bio: "Mod. 6 years in. Read before posting, cite before arguing.",
    location: "Denver, CO",
    role: "MODERATOR",
    daysSinceJoin: 178,
    stack: {
      title: "Maintenance",
      items: [
        { compound: "Sermorelin", dose: "200 mcg", frequency: "5x/wk AM", route: "sub-Q" },
        { compound: "BPC-157", dose: "250 mcg", frequency: "2x/day", route: "sub-Q" },
      ],
    },
  },
  {
    username: "lucidverse",
    name: "Priya",
    bio: "Mod. Biochem background. Don't DM me, post it on the forum.",
    location: "Bay Area",
    role: "MODERATOR",
    daysSinceJoin: 172,
    stack: {
      title: "Research cycle",
      items: [
        { compound: "MOTS-c", dose: "10 mg", frequency: "weekly", route: "sub-Q" },
        { compound: "5-Amino-1MQ", dose: "100 mg", frequency: "daily AM", route: "oral" },
      ],
    },
  },

  // ─── Veterans (8) ──────────────────────────────────────────────────
  {
    username: "hexaclinic",
    name: "Reed",
    bio: "Running protocols since 2020. Former PT, not advice.",
    location: "Austin, TX",
    role: "MEMBER",
    daysSinceJoin: 165,
    stack: {
      title: "Q2 stack",
      items: [
        { compound: "CJC-1295 no DAC", dose: "100 mcg", frequency: "pre-bed", route: "sub-Q" },
        { compound: "Ipamorelin", dose: "200 mcg", frequency: "pre-bed", route: "sub-Q" },
        { compound: "BPC-157", dose: "500 mcg", frequency: "2x/day", route: "sub-Q" },
      ],
    },
  },
  {
    username: "reggae_fiend",
    name: "Eamon",
    bio: "Been in the game a while. Less is more.",
    location: "Portland, OR",
    daysSinceJoin: 162,
    stack: {
      title: "Current",
      items: [
        { compound: "Tesamorelin", dose: "1 mg", frequency: "daily AM", route: "sub-Q" },
      ],
    },
  },
  {
    username: "theoretic",
    name: "David",
    bio: "Software eng. Cycle logs with charts.",
    location: "Toronto",
    daysSinceJoin: 158,
    stack: {
      title: "Longevity",
      items: [
        { compound: "Epithalon", dose: "10 mg", frequency: "10d on / 80d off", route: "sub-Q" },
        { compound: "MOTS-c", dose: "5 mg", frequency: "2x/wk", route: "sub-Q" },
        { compound: "5-Amino-1MQ", dose: "150 mg", frequency: "daily", route: "oral" },
      ],
    },
  },
  {
    username: "quietstorm",
    name: "Keisha",
    bio: "Shift work survivor. Sleep stack evangelist.",
    location: "Chicago, IL",
    daysSinceJoin: 155,
    stack: {
      title: "Nightshift",
      items: [
        { compound: "DSIP", dose: "100 mcg", frequency: "pre-bed", route: "sub-Q" },
        { compound: "Epithalon", dose: "10 mg", frequency: "10d cycles", route: "sub-Q" },
      ],
    },
  },
  {
    username: "pallet_jack",
    name: "Jim",
    bio: "Warehouse work. Recovery peptides keep the shoulder working.",
    location: "Cleveland, OH",
    daysSinceJoin: 151,
    stack: {
      title: "Recovery rotation",
      items: [
        { compound: "BPC-157", dose: "500 mcg", frequency: "2x/day local", route: "sub-Q" },
        { compound: "TB-500", dose: "2 mg", frequency: "2x/wk", route: "sub-Q" },
      ],
    },
  },
  {
    username: "dr_doubt",
    name: "Alex",
    bio: "PhD physiology. Here to read studies, not to tell you what works.",
    location: "Boston, MA",
    daysSinceJoin: 147,
  },
  {
    username: "mothra",
    name: "Em",
    bio: "3 years + 1 big cycle that worked. Now minimal maintenance.",
    location: "Brooklyn, NY",
    daysSinceJoin: 140,
    stack: {
      title: "Light",
      items: [
        { compound: "GHK-Cu", dose: "2 mg", frequency: "topical AM", route: "topical" },
      ],
    },
  },
  {
    username: "nopain_noreign",
    name: "Troy",
    bio: "Ex-jiu jitsu. Joints not what they were. Peptides and PT, in that order.",
    location: "San Diego, CA",
    daysSinceJoin: 137,
    stack: {
      title: "Knee project",
      items: [
        { compound: "BPC-157", dose: "500 mcg", frequency: "2x/day local to knee", route: "sub-Q" },
        { compound: "TB-500", dose: "5 mg", frequency: "weekly loading", route: "sub-Q" },
      ],
    },
  },

  // ─── New-to-peptides (18) ──────────────────────────────────────────
  { username: "wanderlite", name: "Casey", daysSinceJoin: 14, bio: "New here. Learning by reading." },
  { username: "petal_push", name: "Sana", daysSinceJoin: 9 },
  { username: "bpc_baby", name: "Nate", daysSinceJoin: 22, bio: "Starting BPC-157 for tennis elbow. Wish me luck." },
  { username: "curious_catL", daysSinceJoin: 31, bio: "Reading Pepperpedia cover to cover." },
  { username: "lost_my_reps", name: "Drew", daysSinceJoin: 40 },
  { username: "first_vial", name: "Maya", daysSinceJoin: 18 },
  { username: "vintage_lame", daysSinceJoin: 25, bio: "Old dog, new tricks." },
  { username: "new2peptides", daysSinceJoin: 7 },
  { username: "joint_hunter", name: "Ty", daysSinceJoin: 44 },
  { username: "syringe_shy", daysSinceJoin: 11, bio: "Needle-phobic, working on it." },
  { username: "goal_driven", name: "Lucia", daysSinceJoin: 29 },
  { username: "cautious_ox", daysSinceJoin: 52 },
  { username: "questions_mode", daysSinceJoin: 16, bio: "More question marks than periods." },
  { username: "bac_water_noob", name: "Hank", daysSinceJoin: 20 },
  { username: "fresh_cycle", name: "Tori", daysSinceJoin: 35 },
  { username: "reading_mode", daysSinceJoin: 46 },
  { username: "labrat_ish", daysSinceJoin: 23 },
  { username: "late_bloomer_m", daysSinceJoin: 38, bio: "Late 40s, starting peptides for recovery." },

  // ─── Protocol builders (14) ────────────────────────────────────────
  {
    username: "stackbuilder",
    name: "Will",
    daysSinceJoin: 120,
    bio: "I like spreadsheets more than gyms.",
    stack: {
      title: "Growth + recovery",
      items: [
        { compound: "CJC-1295 no DAC", dose: "100 mcg", frequency: "pre-bed", route: "sub-Q" },
        { compound: "Ipamorelin", dose: "200 mcg", frequency: "pre-bed", route: "sub-Q" },
        { compound: "BPC-157", dose: "250 mcg", frequency: "2x/day", route: "sub-Q" },
      ],
    },
  },
  {
    username: "protocolpilot",
    name: "Selene",
    daysSinceJoin: 112,
    stack: {
      title: "Healing + skin",
      items: [
        { compound: "BPC-157", dose: "500 mcg", frequency: "2x/day", route: "sub-Q" },
        { compound: "GHK-Cu", dose: "2 mg", frequency: "nightly topical", route: "topical" },
      ],
    },
  },
  { username: "cyclecraft", name: "Omar", daysSinceJoin: 108 },
  { username: "recomp_rex", name: "Rex", daysSinceJoin: 102 },
  { username: "the_stats_guy", name: "Ben", daysSinceJoin: 99 },
  { username: "taper_time", name: "Ines", daysSinceJoin: 95 },
  { username: "loading_phase", name: "Sam", daysSinceJoin: 91 },
  { username: "frontloader", daysSinceJoin: 88 },
  { username: "slow_titrate", name: "Mina", daysSinceJoin: 80 },
  { username: "protocolwonk", name: "Pat", daysSinceJoin: 76 },
  { username: "stack_nerd", name: "Leo", daysSinceJoin: 74 },
  { username: "cycle_wrangler", name: "Quinn", daysSinceJoin: 70 },
  { username: "the_architect_p", daysSinceJoin: 66 },
  {
    username: "kineticdrift",
    name: "Josie",
    daysSinceJoin: 128,
    stack: {
      title: "Mass Q2",
      items: [
        { compound: "IGF-1 LR3", dose: "30 mcg", frequency: "post-workout", route: "sub-Q" },
        { compound: "CJC-1295 no DAC", dose: "100 mcg", frequency: "pre-bed", route: "sub-Q" },
        { compound: "Ipamorelin", dose: "200 mcg", frequency: "pre-bed", route: "sub-Q" },
        { compound: "MGF (PEG)", dose: "200 mcg", frequency: "post-workout", route: "sub-Q" },
      ],
    },
  },

  // ─── Lab/bloodwork nerds (8) ───────────────────────────────────────
  {
    username: "cbc_cmp",
    name: "Hannah",
    daysSinceJoin: 110,
    bio: "Labs every 6 weeks. Always.",
    stack: {
      title: "GH axis test",
      items: [
        { compound: "Sermorelin", dose: "300 mcg", frequency: "pre-bed", route: "sub-Q" },
        { compound: "Ipamorelin", dose: "200 mcg", frequency: "pre-bed", route: "sub-Q" },
      ],
    },
  },
  { username: "igf_curve", name: "Ravi", daysSinceJoin: 104 },
  { username: "homocystein_x", daysSinceJoin: 90 },
  { username: "panel_maxer", name: "Dana", daysSinceJoin: 85 },
  { username: "dexa_devotee", daysSinceJoin: 79 },
  { username: "apob_reader", name: "Gene", daysSinceJoin: 73 },
  { username: "hba1c_watch", daysSinceJoin: 64 },
  { username: "crp_cassandra", name: "Cass", daysSinceJoin: 58 },

  // ─── GLP-1 cohort (12) ─────────────────────────────────────────────
  {
    username: "tirzepatide_tim",
    name: "Tim",
    daysSinceJoin: 100,
    bio: "36 -> 28 BMI on tirze. Eat more protein.",
    stack: {
      title: "Tirze cycle",
      items: [
        { compound: "Tirzepatide", dose: "5 mg", frequency: "weekly", route: "sub-Q" },
      ],
    },
  },
  {
    username: "sema_saturday",
    name: "Jade",
    daysSinceJoin: 92,
    stack: {
      title: "Week 14",
      items: [
        { compound: "Semaglutide", dose: "1.7 mg", frequency: "weekly", route: "sub-Q" },
      ],
    },
  },
  { username: "retatrutide_r", name: "Ron", daysSinceJoin: 62 },
  { username: "microdose_glp1", daysSinceJoin: 48 },
  { username: "cagrisema", daysSinceJoin: 55 },
  { username: "macrosguru", name: "Carla", daysSinceJoin: 72 },
  { username: "slow_lose", daysSinceJoin: 68 },
  { username: "glp1_doctor_pt", daysSinceJoin: 84 },
  { username: "fat_loss_log", name: "Sasha", daysSinceJoin: 58 },
  { username: "plateau_breaker", daysSinceJoin: 50 },
  { username: "sulfur_shrug", daysSinceJoin: 42 }, // mild GI side effect name
  { username: "fridge_protein", name: "Marco", daysSinceJoin: 36 },

  // ─── Recovery / injury (10) ────────────────────────────────────────
  { username: "acl_again", name: "Drew", daysSinceJoin: 95 },
  { username: "shoulder_spring", name: "Holly", daysSinceJoin: 86 },
  {
    username: "tendon_theory",
    name: "Beck",
    daysSinceJoin: 118,
    bio: "Climber. Finger pulleys hate me.",
    stack: {
      title: "Pulley A2",
      items: [
        { compound: "BPC-157", dose: "250 mcg", frequency: "2x/day local", route: "sub-Q" },
        { compound: "TB-500", dose: "2 mg", frequency: "weekly", route: "sub-Q" },
      ],
    },
  },
  { username: "meniscus_mgmt", daysSinceJoin: 77 },
  { username: "post_surgery_rr", daysSinceJoin: 59 },
  { username: "rotator_rebuild", name: "Gloria", daysSinceJoin: 47 },
  { username: "back_on_the_mat", daysSinceJoin: 39 },
  { username: "knee_ice_me", daysSinceJoin: 28 },
  { username: "tb500_train", daysSinceJoin: 53 },
  { username: "achilles_love", daysSinceJoin: 33 },

  // ─── Cognitive / nootropics (6) ────────────────────────────────────
  {
    username: "semax_mornings",
    name: "Dasha",
    daysSinceJoin: 82,
    stack: {
      title: "Focus stack",
      items: [
        { compound: "Semax", dose: "600 mcg", frequency: "AM intranasal", route: "intranasal" },
        { compound: "Selank", dose: "250 mcg", frequency: "as needed", route: "intranasal" },
      ],
    },
  },
  { username: "selank_silence", daysSinceJoin: 71 },
  { username: "dihexa_doubter", daysSinceJoin: 44 },
  { username: "pde_brainer", daysSinceJoin: 26 },
  { username: "noots_noop", daysSinceJoin: 19 },
  { username: "cerebrolysin_cb", daysSinceJoin: 63 },

  // ─── Sleep / longevity (7) ─────────────────────────────────────────
  { username: "restwise", name: "Aarav", daysSinceJoin: 105 },
  { username: "dreamline", daysSinceJoin: 89 },
  { username: "epi_cycler", daysSinceJoin: 78 },
  { username: "motsc_ops", daysSinceJoin: 67 },
  { username: "nad_nightowl", daysSinceJoin: 51 },
  { username: "humanin_hope", daysSinceJoin: 41 },
  { username: "telomere_t", daysSinceJoin: 32 },

  // ─── Skeptics (4) ──────────────────────────────────────────────────
  {
    username: "showmethestudy",
    name: "Henrik",
    daysSinceJoin: 100,
    bio: "If it's rodent data, say rodent data.",
  },
  { username: "nullhypothesis", name: "Renee", daysSinceJoin: 93 },
  { username: "placebo_possible", daysSinceJoin: 69 },
  { username: "citation_required", daysSinceJoin: 54 },

  // ─── Lurkers / lighter posters (11) ────────────────────────────────
  { username: "reads_more_posts", daysSinceJoin: 130 },
  { username: "weekendwarrior_p", daysSinceJoin: 60 },
  { username: "silentscroll", daysSinceJoin: 48 },
  { username: "once_per_month", daysSinceJoin: 37 },
  { username: "just_observing", daysSinceJoin: 27 },
  { username: "polite_guest", daysSinceJoin: 21 },
  { username: "thread_saver", daysSinceJoin: 17 },
  { username: "slow_typer_s", daysSinceJoin: 13 },
  { username: "low_post", daysSinceJoin: 8 },
  { username: "reclusive_rn", daysSinceJoin: 24 },
  { username: "notes_taker", daysSinceJoin: 30 },
];

// Quick sanity check at import time
if (USERS.length !== 100) {
  throw new Error(`Expected 100 USERS, got ${USERS.length}`);
}
