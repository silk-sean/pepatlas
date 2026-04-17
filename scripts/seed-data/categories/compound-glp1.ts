import type { SeedThread } from "../types";

// ================================================================
// SEMAGLUTIDE — 14 threads
// 3 popular (15-25 replies) + 5 active (6-12 replies) + 6 quiet (2-5 replies)
// ================================================================

export const THREADS_SEMAGLUTIDE: SeedThread[] = [
  // ============================================================
  // POPULAR — 1
  // ============================================================
  {
    title: "Standard sema titration 0.25 -> 0.5 -> 1.0 -> 1.7 -> 2.4 — who actually followed it and who didn't",
    body: "The FDA-label schedule is 4 weeks per step, which puts you at 2.4mg at week 17. My question to the room: who stuck to it verbatim, who went slower, who jumped faster, and what did you see?\n\nMe: 38F, started at 224lb, BMI 36. I ran the official schedule the first 8 weeks (0.25 x4w, 0.5 x4w). At 0.5 I was still losing ~1.5lb/wk so I held there for 8 weeks instead of moving to 1.0. Side effects basically zero. When the loss flattened I stepped to 1.0 and got another 10lb over 10 weeks before stalling.\n\nThe more I read here the more I think the titration schedule on the label is a tolerability ladder, not an efficacy ladder. The goal isn't to get to 2.4 — the goal is the lowest dose that keeps you losing. Some people are 'done' at 1.0 mg forever.\n\nWho's held at a sub-max dose successfully? And conversely, who needed the full 2.4 to see real movement?",
    author: "sema_saturday",
    daysAgo: 58,
    views: 7240,
    reactions: { LIKE: 19, USEFUL: 16, THANKS: 11, AGREE: 8 },
    replies: [
      { author: "slow_titrate", body: "Hard agree on 'tolerability ladder, not efficacy ladder.' I've held at 0.5 for 9 months and lost 41lb. Zero reason to push higher when the signal is still moving. The label schedule exists because the trials pushed everyone to 2.4 for statistical power, not because 2.4 is the correct dose for every human.", daysAgo: 57, reactions: { AGREE: 14, USEFUL: 11, LIKE: 5 } },
      { author: "plateau_breaker", body: "Counterpoint — I needed 2.4 to see real appetite suppression. 1.0 did almost nothing for me, 1.7 was okay, 2.4 was the first dose where the food noise genuinely went quiet. Some of this is receptor density / genetics and you can't predict it from how 0.5 felt.", daysAgo: 57, reactions: { AGREE: 10, USEFUL: 6 } },
      { author: "fat_loss_log", body: "I doubled the label ramp — 2w per step instead of 4w — because I was impatient. Got smoked by nausea at 1.0 and had to drop back to 0.5 for a month to recover. Would not do again. The 4w rhythm exists for a reason even if you ultimately don't need every step.", daysAgo: 56, reactions: { AGREE: 9, FUNNY: 6, USEFUL: 5 } },
      { author: "macrosguru", body: "Question that isn't asked enough: are you weighing weekly with a consistent protocol (AM, fasted, after bathroom, same scale)? Because 'I stalled' after 3 weeks of noise on a daily scale is not stalling. Sema loss is non-linear and lumpy — you can sit flat for 10 days then drop 3lb overnight as water redistributes.", daysAgo: 56, reactions: { USEFUL: 13, AGREE: 9 } },
      { author: "sema_saturday", body: "@macrosguru yes — weekly average of 5 daily weigh-ins, fasted AM, same scale. The 'stall' I called was a 14-day flat moving average. That's real, not noise.", daysAgo: 55, reactions: { LIKE: 4 } },
      { author: "hexaclinic", body: "The titration discussion is downstream of a bigger question: what are you titrating toward? If the goal is 2lb/wk loss, you titrate until you hit that rate, then hold. If the goal is 'maximum appetite suppression for compliance,' you might push higher than needed for the weight rate alone. People conflate these.", daysAgo: 55, reactions: { USEFUL: 14, AGREE: 10, LIKE: 4 } },
      { author: "slow_lose", body: "I'm the opposite of everyone here — on 0.25 for 7 months, lost 22lb, never went up. Side effects were real at 0.25 for the first 6 weeks and I was scared to increase. Turns out I didn't need to. My doctor was skeptical the whole time.", daysAgo: 54, reactions: { LIKE: 8, AGREE: 5, USEFUL: 4 } },
      { author: "glp1_doctor_pt", body: "Not medical advice but I'll share the framing I use with patients (not on this forum, IRL): titrate to effect, not to label. The label is for the prescriber who doesn't have time to individualize. If you're here you can individualize. If you're losing 0.5-1% bw/week and tolerating it, don't move.", daysAgo: 54, reactions: { USEFUL: 17, AGREE: 11, THANKS: 6 } },
      { author: "dr_doubt", body: "The 'lowest effective dose' framing is correct but I'd add: define 'effective' with a stopping rule. If loss falls below X lb/mo for Y consecutive months, step up. Otherwise you hold until you stop losing, and now you don't know if you plateaued or if you'd have plateaued later anyway on the lower dose.", daysAgo: 53, reactions: { AGREE: 12, USEFUL: 9 } },
      { author: "wanderlite", body: "First sema user here. Thread is gold. How do you all handle the week between stepping up — do you move dose on a specific injection day or just next week?", daysAgo: 53, reactions: { LIKE: 3 } },
      { author: "sema_saturday", body: "@wanderlite I move on my regular injection day. Same day of the week every week, every dose. Makes it easier to pattern-match side effects to the dose change.", daysAgo: 52, reactions: { USEFUL: 6, THANKS: 3 } },
      { author: "microdose_glp1", body: "Running 0.1mg weekly for 10 months. Technically below label start. Lost 14lb and my HbA1c dropped from 5.9 to 5.4. For me the goal was metabolic, not weight. The label titration is irrelevant to that use case and I think there's a whole cohort of people for whom that's true.", daysAgo: 52, reactions: { USEFUL: 12, AGREE: 7, LIKE: 5 } },
      { author: "protocolwonk", body: "The 4-week step is also driven by how long it takes sema to reach new steady state at the higher dose (half life ~7 days, so ~4-5 half lives to plateau). If you step up faster you're stacking accumulating drug on top of not-yet-equilibrated drug. That's the pharmacokinetic reason — the tolerability framing is just the clinical expression of it.", daysAgo: 51, reactions: { USEFUL: 15, AGREE: 8, LIKE: 4 } },
      { author: "petal_push", body: "Saving. I'm 3 weeks into 0.25 and was worried I was 'behind' because the scale moved 2lb total. Reading this I think I just need to not touch the dose yet.", daysAgo: 50, reactions: { LIKE: 5 } },
      { author: "sema_saturday", body: "@petal_push first 3-4 weeks for most people is adjustment, not loss. The body is figuring out the delayed gastric emptying. Real weight movement for me kicked in week 5.", daysAgo: 50, reactions: { USEFUL: 7, THANKS: 4 } },
      { author: "nullhypothesis", body: "Every 'I held at 0.5' post here is survivorship bias — the people for whom 0.5 didn't work moved up and aren't posting in this thread. Would love to see both populations represented before drawing conclusions.", daysAgo: 49, reactions: { AGREE: 8, USEFUL: 5, LIKE: 3 } },
      { author: "plateau_breaker", body: "@nullhypothesis that's literally what I did. 1.0 didn't work. I'm here. The distribution of responders exists across all doses.", daysAgo: 49, reactions: { AGREE: 6, LIKE: 3 } },
      { author: "taper_time", body: "Nobody talks about titrating DOWN. I went 2.4 -> 1.7 -> 1.0 over 16 weeks after hitting goal and it worked fine for maintenance. Symmetry of on-ramp and off-ramp matters for avoiding rebound hunger.", daysAgo: 48, reactions: { USEFUL: 11, AGREE: 6 } },
      { author: "reads_more_posts", body: "Bookmarked. This is the kind of thread that's worth the subscription by itself.", daysAgo: 45, reactions: { LIKE: 4 } },
    ],
  },

  // ============================================================
  // POPULAR — 2
  // ============================================================
  {
    title: "Why does it smell like eggs — sulfur burps on sema and what actually helps",
    body: "I am not exaggerating when I say my burps smell like a rotten boiled egg locker room. I want to know two things: 1) what's the mechanism, 2) what the hell actually works because Google gives me a useless list of 'stay hydrated.'\n\nMy context: 0.5mg sema, week 6. Started at 0.25 and the burps were mild. Increased to 0.5 and my partner has started fake-coughing when I exhale. It's humbling.\n\nWhat I've tried:\n- Hydration — zero effect.\n- Less sulfur-rich food (cruciferous, eggs, red meat) — modest effect, burps still smelly, just less frequent.\n- Pepto Bismol before meals — actually noticeable improvement. Mechanism something about binding sulfides I think.\n- Famotidine 20mg — didn't do much for the smell, did help general GI.\n- Digestive enzymes w/ meals — placebo territory for me.\n\nWhat's working for you? And does this go away or is this my life on sema now?",
    author: "sulfur_shrug",
    daysAgo: 42,
    views: 9180,
    reactions: { LIKE: 22, FUNNY: 28, USEFUL: 14, THANKS: 9 },
    replies: [
      { author: "fridge_protein", body: "The mechanism is real. Sema slows gastric emptying, food sits longer, sulfur-producing bacteria have more substrate and time to make hydrogen sulfide. That's the rotten-egg smell. Less food in stomach = less smell. Pepto Bismol (bismuth subsalicylate) literally binds sulfides into bismuth sulfide, which is black and inert. That's why your stool might also go dark while using it — normal.", daysAgo: 41, reactions: { USEFUL: 21, THANKS: 11, LIKE: 6 } },
      { author: "macrosguru", body: "Smaller meals. This is the single biggest lever nobody wants to hear. If you eat 800 kcal in one sitting on sema, that food is going to hang out for hours. Split into 400 + 400 and the smell drops by half, in my experience.", daysAgo: 41, reactions: { AGREE: 11, USEFUL: 9 } },
      { author: "sema_saturday", body: "For me sulfur burps went away by week 10-12. Not gone, just not weaponized. I think the gut microbiome adapts to the slower transit over a couple months. Hang in there.", daysAgo: 40, reactions: { AGREE: 9, THANKS: 4 } },
      { author: "sulfur_shrug", body: "@fridge_protein that mechanism explanation is the most useful thing I've read all week. Thank you. Going to double down on Pepto and smaller meals and accept the black stool.", daysAgo: 40, reactions: { THANKS: 6, LIKE: 4 } },
      { author: "plateau_breaker", body: "Underrated: cut eggs and red meat for 48h before the expected peak (day 2-4 post-injection). That's when I get the worst of it. Outside that window I can eat normally. The peak window is when gastric emptying is slowest.", daysAgo: 39, reactions: { USEFUL: 12, AGREE: 6 } },
      { author: "quietstorm", body: "Activated charcoal caps — 500mg with the offending meal. Binds the H2S. Don't take it with your sema injection day meds or anything else you need absorbed. Works for me when I have to travel and can't avoid buffet food.", daysAgo: 39, reactions: { USEFUL: 8, LIKE: 4 } },
      { author: "showmethestudy", body: "Activated charcoal does bind non-specifically. So yes it'll bind sulfides and also your multivitamin and whatever medication you took two hours ago. Fine as rescue, bad as routine.", daysAgo: 38, reactions: { AGREE: 7, USEFUL: 5 } },
      { author: "joint_hunter", body: "My partner made me read this thread out loud over breakfast as punishment. For the record: hydrogen sulfide burps went away at week 8 for me, held there ever since on 1.0.", daysAgo: 37, reactions: { FUNNY: 14, LIKE: 5 } },
      { author: "curious_catL", body: "Zofran for the nausea that tends to come WITH the sulfur burps for me. Doesn't help smell, does help being able to function during the worst days.", daysAgo: 36, reactions: { USEFUL: 6 } },
      { author: "sulfur_shrug", body: "Update a week in: Pepto before each meal + meal splitting has cut it 70%. Partner no longer fake-coughs. Marriage saved by this thread.", daysAgo: 35, reactions: { FUNNY: 18, LIKE: 8, THANKS: 5 } },
      { author: "fridge_protein", body: "@sulfur_shrug good outcome. One more tip for when it's back: peppermint tea post-meal genuinely helps motility a bit. Not magic but real.", daysAgo: 35, reactions: { USEFUL: 5, LIKE: 3 } },
      { author: "bac_water_noob", body: "Wild how specific these side effects get. Filed away for when I start.", daysAgo: 33, reactions: { LIKE: 3 } },
      { author: "hexaclinic", body: "Secondary point — if sulfur burps are accompanied by upper abdominal pain that doesn't go away, get labs (lipase, amylase) and don't wait. Most sulfur burps are benign gastric slowdown. Rarely they're a signal of something that needs eyes on it.", daysAgo: 32, reactions: { USEFUL: 13, AGREE: 8, THANKS: 4 } },
      { author: "slow_lose", body: "I will say — sulfur burps are the symptom that almost made me quit. Reading people say it goes away at week 8-12 kept me on. It did. Worth pushing through if you can.", daysAgo: 30, reactions: { LIKE: 6, THANKS: 3 } },
      { author: "thread_saver", body: "Saving. This thread is going to help more people than any label insert.", daysAgo: 28, reactions: { LIKE: 5 } },
    ],
  },

  // ============================================================
  // POPULAR — 3
  // ============================================================
  {
    title: "Muscle loss on sema — the protein target nobody wants to commit to",
    body: "Going to put a stake in the ground: if you're on a GLP-1 and not eating 1g protein per lb of goal body weight AND doing resistance training 3x/wk, you are losing meaningful muscle. The weight loss is real but the body composition question is separate and it's being under-discussed in sema threads.\n\nData I care about:\n- STEP trials showed ~40% of lost weight was lean mass in the non-training arm. Forty percent. That's not a rounding error, that's a body composition problem.\n- Studies with resistance training + adequate protein on GLP-1s show LBM preservation closer to 10-15% of loss. Still not zero, but enormously better.\n\nMy frame: the drug makes you eat less. You have to actively engineer the diet you do eat around protein-first. Appetite suppression makes that mechanically hard — you don't want 180g protein when you don't want to eat at all. Solutions I've seen work:\n- Protein shakes as the 'meal' on peak side effect days. 2 scoops whey in water is 50g and mostly liquid.\n- Greek yogurt, cottage cheese, skyr as fallback when real food is unappetizing.\n- Egg whites (cooked) as the highest density per kcal.\n- Protein-forward soup on the worst nausea days.\n\nAnd yes: lift heavy things. Two compound movements + accessory per session is enough. Don't program for hypertrophy volume on a 500kcal deficit — program for retention.\n\nWho's tracking LBM objectively? DEXA? BIA? Any data to share?",
    author: "fridge_protein",
    daysAgo: 71,
    views: 6830,
    reactions: { LIKE: 24, USEFUL: 19, AGREE: 15, THANKS: 8 },
    replies: [
      { author: "dexa_devotee", body: "Serial DEXA here. 42M, 218 -> 181 over 9 months on 1.0 sema. LBM dropped from 158 to 152 — so 6lb of lean for 37lb total. That's 16% of loss as lean, which tracks with trained-and-protein-fed literature. I'm lifting 4x/wk, averaging 180g protein on 215lb goal weight. Confirming the playbook works.", daysAgo: 70, reactions: { USEFUL: 18, LIKE: 8, AGREE: 6 } },
      { author: "recomp_rex", body: "The 1g/lb target is widely pushed but for most people 0.8g/lb of goal weight is adequate when combined with resistance training. Above 0.8 the muscle-retention curve is flat in the literature. 1g is a margin-of-safety target, which is fine, but don't let people think 0.8 is inadequate.", daysAgo: 70, reactions: { USEFUL: 11, AGREE: 8 } },
      { author: "fridge_protein", body: "@recomp_rex fair. 0.8g/lb goal weight + lifting is the floor. 1g is the ceiling where further gains taper. I push the ceiling because under-shooting on a GLP-1 is so easy.", daysAgo: 70, reactions: { AGREE: 9, LIKE: 3 } },
      { author: "slow_lose", body: "I am NOT hitting 0.8g/lb. I'm hitting maybe 0.5. I'm also not training. I'm losing weight and I feel fine. Is my LBM dropping? Probably. Do I care enough to force 150g/day of food I don't want? Not right now.", daysAgo: 69, reactions: { LIKE: 5, AGREE: 3 } },
      { author: "hexaclinic", body: "@slow_lose that's a legitimate choice but state it as a choice. You're trading future metabolic floor and physical resilience for present-day convenience. Both are real. The issue is people who think they're not making the trade.", daysAgo: 69, reactions: { AGREE: 17, USEFUL: 10, LIKE: 5 } },
      { author: "nopain_noreign", body: "Counterintuitive lift suggestion: train 2x/wk full-body, not 4x/wk split. On a deficit the limiter is recovery, not frequency. I kept every compound lift +/- 5% through a 40lb cut on sema running 2x/wk, 5x5 rep range, no accessory volume.", daysAgo: 68, reactions: { AGREE: 10, USEFUL: 8, LIKE: 5 } },
      { author: "macrosguru", body: "Protein powder take: whey isolate > concentrate on sema. Isolate is faster-clearing from the stomach. On a slowed-gastric-emptying drug, anything that clears faster is a win for tolerability. Casein at night is the exception — you want that slow.", daysAgo: 68, reactions: { USEFUL: 9, LIKE: 4 } },
      { author: "sema_saturday", body: "Cottage cheese is the MVP food of GLP-1 protocols and I will die on this hill. 24g protein per cup, low volume, low sulfur, easy on the stomach, mixes with any fruit. Three cups a day covers a lot of protein on a day you don't want solid food.", daysAgo: 67, reactions: { AGREE: 14, LIKE: 8, USEFUL: 5 } },
      { author: "citation_required", body: "The STEP trials' lean mass data was DXA-based which overestimates lean loss compared to MRI-based lean measures. The 40% figure is probably an upper bound. True lean loss in STEP was likely closer to 25-30% of total weight. Still meaningful but worth the accuracy.", daysAgo: 66, reactions: { USEFUL: 13, AGREE: 7 } },
      { author: "fridge_protein", body: "@citation_required correct, and worth stating. I use 40% as a worst-case to scare people into the gym. True figure is lower but still significant.", daysAgo: 66, reactions: { AGREE: 5, USEFUL: 3 } },
      { author: "wanderlite", body: "What counts as 'resistance training' for someone who's never lifted? Bodyweight? Resistance bands? I'm 54F and intimidated by the free weight area.", daysAgo: 64, reactions: { LIKE: 4 } },
      { author: "nopain_noreign", body: "@wanderlite progressive overload with something, anything. Resistance bands count. Bodyweight squats, push-ups, dumbbell rows with a 15lb dumbbell. The muscle doesn't care about aesthetics of the gym, it cares about being asked to work against increasing resistance 2-3x/wk.", daysAgo: 64, reactions: { USEFUL: 14, LIKE: 6, THANKS: 4 } },
      { author: "plateau_breaker", body: "Anecdata but grip strength is my leading indicator of LBM loss on GLP-1s. If my deadlift top set grip starts failing earlier than usual I know I've been under-eating protein for 2-3 weeks. Cheap proxy for DEXA between scans.", daysAgo: 63, reactions: { USEFUL: 10, LIKE: 5 } },
      { author: "protocolpilot", body: "Additional lever: creatine 5g/day. Widely studied, cheap, no reason not to, and preserves training performance on a deficit. It's the one supplement I'd put alongside protein for anyone on a GLP-1.", daysAgo: 62, reactions: { AGREE: 12, USEFUL: 7, LIKE: 4 } },
      { author: "syringe_shy", body: "Is there a point where the muscle loss is enough to make the drug not worth it? Like if I lose 30lb but 12 of it is lean, am I better off at my start weight with more muscle?", daysAgo: 60, reactions: { LIKE: 3 } },
      { author: "hexaclinic", body: "@syringe_shy depends on start point. If you're starting with a body fat % where metabolic risk dominates (e.g. BMI >35, T2D, NAFLD), losing weight even with some lean loss nets positive on almost every health axis. If you're starting at BMI 28 trying to get to 24, the calculus shifts and lean preservation matters much more.", daysAgo: 60, reactions: { USEFUL: 16, AGREE: 9, THANKS: 5 } },
      { author: "dr_doubt", body: "The correct frame: the drug enables the deficit, the protocol determines what the deficit costs you. Sema without protein and lifting is a body recomposition lottery. Sema with both is a body recomposition tool.", daysAgo: 58, reactions: { AGREE: 19, USEFUL: 10, LIKE: 8 } },
      { author: "reggae_fiend", body: "Stealing dr_doubt's line. 'The drug enables the deficit, the protocol determines what the deficit costs you.' Putting that in every GLP-1 thread I reply to.", daysAgo: 57, reactions: { LIKE: 9, FUNNY: 3 } },
      { author: "goal_driven", body: "Saving this whole thread. Starting sema next week at 32F, 196lb, goal 150. Wasn't going to lift. Changed my mind. Thank you.", daysAgo: 54, reactions: { THANKS: 7, LIKE: 5 } },
      { author: "late_bloomer_m", body: "Came for weight loss info, leaving with a training plan. Forum at its best.", daysAgo: 50, reactions: { LIKE: 6 } },
    ],
  },

  // ============================================================
  // ACTIVE — 1 (Microdosing)
  // ============================================================
  {
    title: "Microdosing sema — 0.1-0.2mg/week experiences. Minimal side effects, real benefits?",
    body: "Interested in hearing from people running sub-label doses (0.1-0.25mg/wk) long-term. Not for dramatic weight loss — for metabolic benefit, food noise reduction, and general craving management with near-zero side effects.\n\nMy setup: 0.15mg weekly, 11 months in. 34M, was 184lb BMI 25.5, now 171lb BMI 23.7. Fasting glucose 98 -> 84. HbA1c 5.5 -> 5.2. Food noise around sweets basically gone. Zero nausea, zero sulfur, zero GI issues. Compliance trivial.\n\nWho else is running small doses for metabolic purposes and what are you seeing?",
    author: "microdose_glp1",
    daysAgo: 64,
    views: 3890,
    reactions: { LIKE: 12, USEFUL: 9, AGREE: 5, THANKS: 4 },
    replies: [
      { author: "hba1c_watch", body: "0.1mg/wk here, 8 months. HbA1c 5.8 -> 5.3, fasting insulin 11 -> 6, HOMA-IR halved. Goal was metabolic not cosmetic. Weight dropped 7lb as a side effect. This is a real use case that the label doesn't acknowledge because the trials were powered on weight endpoints.", daysAgo: 63, reactions: { USEFUL: 14, AGREE: 6 } },
      { author: "slow_lose", body: "0.2mg since February. Biggest unexpected benefit was alcohol — I just... stopped wanting to drink. Two glasses of wine a week at most now, down from a bottle. Nobody told me this would happen.", daysAgo: 62, reactions: { USEFUL: 8, LIKE: 6 } },
      { author: "showmethestudy", body: "Microdosing is underserved by the literature because trials don't run there, so all the evidence is N=1 anecdote. That said, the mechanism plausibility is strong — GLP-1 receptor signaling is dose-responsive, you can get meaningful effect below the weight-loss threshold. Just flag it's extrapolation.", daysAgo: 62, reactions: { AGREE: 9, USEFUL: 5 } },
      { author: "microdose_glp1", body: "@showmethestudy agreed. I wouldn't tell anyone to replace a prescribed T2D protocol with 0.1mg microdose. But as an adjunct to diet/exercise for a pre-diabetic trajectory, the risk/benefit looks very favorable to me.", daysAgo: 62, reactions: { AGREE: 6 } },
      { author: "apob_reader", body: "ApoB dropped 18 points on 0.15mg over 6 months for me. Didn't change diet meaningfully. Would have needed a statin otherwise. I'm keeping this going indefinitely.", daysAgo: 61, reactions: { USEFUL: 10, LIKE: 4 } },
      { author: "cagrisema", body: "Stacking microdose sema with microdose cagrilintide (0.2mg each weekly) has been the cleanest protocol I've run. Amylin analogs synergize with GLP-1 and at low doses the side effect profile stays negligible. Food noise is genuinely silent.", daysAgo: 60, reactions: { USEFUL: 8, AGREE: 4, LIKE: 3 } },
      { author: "reads_more_posts", body: "This whole thread is why I read here. Label-centric discourse on GLP-1s misses 70% of the real-world use cases.", daysAgo: 58, reactions: { LIKE: 7 } },
      { author: "cautious_ox", body: "Question — at 0.1-0.2mg are you seeing any side effects I should expect if I try this? Or is it genuinely sub-threshold?", daysAgo: 55, reactions: { LIKE: 2 } },
      { author: "microdose_glp1", body: "@cautious_ox I had mild nausea the first 2 weeks then nothing. Some people don't even get that. At 0.1mg you're so far below the nausea-inducing level that most people feel nothing. That's the point.", daysAgo: 55, reactions: { USEFUL: 4, THANKS: 3 } },
    ],
  },

  // ============================================================
  // ACTIVE — 2 (Nausea management)
  // ============================================================
  {
    title: "Nausea management toolkit — what actually works vs 'stay hydrated'",
    body: "Sharing my full playbook after 9 months on sema (currently 1.7mg) because the generic advice online is useless. My wife is starting next month and I wanted one place to point her.\n\nWhat works:\n1. Zofran (ondansetron) 4mg as needed — prescription, most useful tool I have.\n2. Bland diet on peak days (days 2-4 post-injection). Plain rice, chicken, toast, banana. No fat, no sauce, no spice.\n3. Eating BEFORE hunger. If I wait till I'm hungry on sema, I'm already past the window where food sounds okay.\n4. Small meals 4-5x/day vs 2-3 big ones. Smaller volume = less 'food stuck' feeling.\n5. Injection timing at night instead of morning — you sleep through the worst 12h.\n6. Ginger tea / ginger chews — mild but real.\n7. Cold foods > hot foods on bad days. Smells less, easier to get down.\n\nWhat didn't work for me: Dramamine, B6, acupressure bands, 'just push through it.'\n\nWhat are you using?",
    author: "plateau_breaker",
    daysAgo: 46,
    views: 4220,
    reactions: { LIKE: 14, USEFUL: 12, THANKS: 8 },
    replies: [
      { author: "curious_catL", body: "Zofran was the difference between 'quitting sema' and 'staying on sema' for me. My doctor prescribed 10 tabs a month with one refill. Used maybe 3 per month. Just having them removes the anxiety of 'what if I get nauseous.'", daysAgo: 45, reactions: { AGREE: 7, USEFUL: 5, THANKS: 3 } },
      { author: "sema_saturday", body: "Night injection is underrated. Thursday 9pm for me — by Friday afternoon when peak nausea would hit, I'm back down to tolerable. Weekend is free of the worst of it.", daysAgo: 44, reactions: { USEFUL: 9, AGREE: 5 } },
      { author: "fat_loss_log", body: "Add: limit fat. High-fat meals on sema are the single biggest nausea trigger for me. 20g fat at a meal is fine, 40g is misery for 8 hours. Carbs + lean protein is the tolerable macro split.", daysAgo: 44, reactions: { USEFUL: 8, AGREE: 6 } },
      { author: "glp1_doctor_pt", body: "Not medical advice but the antiemetic ladder I've seen work in clinical settings: ginger first line, B6+doxylamine (yes, the pregnancy nausea combo) second, ondansetron third. Prochlorperazine if it's intractable. Don't skip to the top of the ladder without trying the bottom.", daysAgo: 43, reactions: { USEFUL: 14, AGREE: 7, THANKS: 5 } },
      { author: "fridge_protein", body: "Critical add — if nausea is paired with upper right quadrant pain that doesn't resolve, that's not sema nausea, that's gallbladder. Gallstones show up in GLP-1 users at elevated rates. Don't rationalize real pain as 'just sema.'", daysAgo: 43, reactions: { USEFUL: 16, AGREE: 10, THANKS: 6 } },
      { author: "petal_push", body: "Saving this. Starting my first injection tomorrow and the anxiety about nausea is real.", daysAgo: 42, reactions: { LIKE: 4 } },
      { author: "plateau_breaker", body: "@petal_push 0.25mg first dose for most people is mild. Don't pre-stress the 0.25. The harder dose is 1.0 and you're months from that.", daysAgo: 42, reactions: { USEFUL: 6, THANKS: 5 } },
      { author: "bac_water_noob", body: "Is nausea permanent or does the body adjust? I hear both answers online.", daysAgo: 40, reactions: { LIKE: 2 } },
      { author: "sema_saturday", body: "@bac_water_noob adjusts for most. Each dose step brings a 2-4 week nausea wave that then fades. At steady-state dose for 4+ weeks, most people have minimal nausea. Dose escalations reset the clock.", daysAgo: 40, reactions: { USEFUL: 7, AGREE: 4 } },
    ],
  },

  // ============================================================
  // ACTIVE — 3 (Constipation)
  // ============================================================
  {
    title: "Constipation on sema — fiber strategies that actually work",
    body: "Constipation on sema is brutal and underdiscussed. I went from daily BM my whole life to going 3-4 days without one within 2 weeks of starting 0.25. Here's what I've tried and ranked.\n\nWorked:\n- Psyllium (Metamucil) — 2 rounded tsp in water twice daily. Non-negotiable.\n- Magnesium citrate 400mg nightly — helps but can tip into urgency if combined with high water day.\n- 80oz+ water daily — fiber without water is useless, bordering on worse.\n- Coffee first thing in the AM — stimulant effect on colon is meaningful.\n\nPartial/meh:\n- Prunes — nice idea, not enough volume to matter.\n- Flaxseed — 2 tbsp/day. Mild help, not a primary tool.\n\nDidn't work:\n- Just 'adding vegetables.' Not concentrated enough.\n- Senna tea — works but brutal next-day. Emergency use only.\n\nWho's on sema without constipation problems? What's your secret?",
    author: "sema_saturday",
    daysAgo: 53,
    views: 3540,
    reactions: { LIKE: 11, USEFUL: 9, THANKS: 4 },
    replies: [
      { author: "macrosguru", body: "Magnesium glycinate 400mg + 200mg citrate. Glycinate for general magnesium status, citrate for the laxative effect. Running both has been my long-term answer. Glycinate alone doesn't cut it for constipation.", daysAgo: 52, reactions: { USEFUL: 8, AGREE: 4 } },
      { author: "fridge_protein", body: "Kiwifruit — two green kiwis a day. There's actually a reasonable literature base on this for chronic constipation (actinidin enzyme). Tastes good, works within 48h, sustainable. Cheaper than half the supplements people try.", daysAgo: 52, reactions: { USEFUL: 11, LIKE: 5 } },
      { author: "slow_lose", body: "Chia seed pudding — 2 tbsp chia in 1/2 cup almond milk, refrigerate overnight. 12g fiber. Easy breakfast on nausea days, solves two problems.", daysAgo: 51, reactions: { USEFUL: 7, LIKE: 4 } },
      { author: "plateau_breaker", body: "Squatty Potter or a stepstool in the bathroom. Posture matters. This is unglamorous advice but it's real.", daysAgo: 50, reactions: { AGREE: 5, FUNNY: 6 } },
      { author: "hexaclinic", body: "Don't under-rate hydration. Most 'constipation on sema' I see is actually mild dehydration + slowed transit + low fiber. Fix the water first and a lot of the rest resolves. 100oz+ if you're lifting in the heat.", daysAgo: 49, reactions: { USEFUL: 8, AGREE: 5 } },
      { author: "wanderlite", body: "Week 3 on sema, this is my biggest complaint. Buying psyllium today.", daysAgo: 46, reactions: { LIKE: 3 } },
      { author: "sema_saturday", body: "@wanderlite start low — 1 tsp once daily in a full glass of water, work up over a week. Too much fiber too fast is its own flavor of misery.", daysAgo: 46, reactions: { USEFUL: 5, THANKS: 3 } },
    ],
  },

  // ============================================================
  // ACTIVE — 4 (DIY reconstitution math)
  // ============================================================
  {
    title: "DIY reconstitution math — 10mg vial + 2mL bac water, someone double check my numbers",
    body: "Want a sanity check before I inject. First time reconstituting.\n\n10mg sema vial. Adding 2mL bacteriostatic water.\nConcentration = 10mg / 2mL = 5mg/mL.\n\nFor 0.25mg dose: 0.25 / 5 = 0.05mL = 5 units on a U-100 insulin syringe.\nFor 0.5mg dose: 0.5 / 5 = 0.10mL = 10 units.\nFor 1.0mg dose: 1.0 / 5 = 0.20mL = 20 units.\n\nAm I right that the U-100 insulin syringe '10 units' mark = 0.10mL? I keep seeing conflicting stuff online where people conflate 'units' of insulin vs units on the syringe as a volume measure.\n\nAlso: how long is the 10mg vial good for reconstituted in the fridge?",
    author: "bac_water_noob",
    daysAgo: 39,
    views: 2880,
    reactions: { LIKE: 6, USEFUL: 5, THANKS: 3 },
    replies: [
      { author: "the_stats_guy", body: "Math is correct. U-100 insulin syringe: '100 units' = 1mL by volume. So 10 units = 0.10mL. Your numbers are right.", daysAgo: 39, reactions: { USEFUL: 8, THANKS: 3 } },
      { author: "protocolwonk", body: "Reconstituted sema is stable ~28 days refrigerated per manufacturer stability data for the branded product. Research chem versions are not stability-tested, so 28 days is the cautious upper bound. Many users report using longer without issues but you're extrapolating.", daysAgo: 38, reactions: { USEFUL: 9, AGREE: 5 } },
      { author: "bac_water_noob", body: "@the_stats_guy @protocolwonk thanks both. Doing 2mL because I want the 5mg/mL concentration for easier small-dose draws. If I'd done 1mL I'd have 10mg/mL which makes 0.25mg = 2.5 units, harder to measure accurately.", daysAgo: 38, reactions: { LIKE: 3 } },
      { author: "stackbuilder", body: "Concentration choice is correct. 2mL bac water is my standard for 10mg vials — gives you readable measurements at every dose step from 0.25 through 2.4. Don't go more dilute than that or you're pushing 0.5mL IM volumes for high doses.", daysAgo: 37, reactions: { USEFUL: 7, AGREE: 4 } },
      { author: "cyclecraft", body: "Note: for Sub-Q injection, even 0.5mL is fine, but anything over that starts to sting / leak. Your 5mg/mL choice keeps every dose under 0.5mL comfortably. Good call.", daysAgo: 37, reactions: { USEFUL: 5 } },
      { author: "cardinal_rule", body: "General PSA for this kind of thread: always double-check recon math with a second reference. A decimal-point mistake here is a 10x dose error and sema at 10x dose is a hospital trip. Slow down, check twice.", daysAgo: 36, reactions: { USEFUL: 12, AGREE: 9, THANKS: 4 } },
    ],
  },

  // ============================================================
  // ACTIVE — 5 (Getting off sema)
  // ============================================================
  {
    title: "Getting off sema — rebound weight experiences, how bad is it really",
    body: "I'm approaching goal weight (down 54lb) and the fear of rebound is making me anxious about stopping. The STEP-4 trial data is discouraging — people regained ~2/3 of lost weight within a year of stopping.\n\nBut the trial stopped sema cold turkey in people who weren't necessarily doing anything else lifestyle-wise. I want to hear from people who tapered deliberately, kept lifting, tracked food. Is rebound inevitable or is it avoidable with a plan?\n\nCurrently on 1.7mg. Plan to step down to 1.0, then 0.5, then 0.25, then off, over ~16 weeks. Keeping strength training 3x/wk and ~180g protein. What am I missing?",
    author: "goal_driven",
    daysAgo: 49,
    views: 3760,
    reactions: { LIKE: 10, USEFUL: 8, AGREE: 3 },
    replies: [
      { author: "taper_time", body: "Tapered over 20 weeks, kept training, stayed within 3lb of my stop-weight for 14 months and counting. The STEP-4 rebound cohort included zero behavioral intervention. If you're here and actively managing, your curve does not look like the average STEP-4 curve.", daysAgo: 48, reactions: { USEFUL: 13, AGREE: 8, LIKE: 5 } },
      { author: "microdose_glp1", body: "Consider not going to zero. Staying at 0.1-0.25mg indefinitely is what a lot of veterans do. The metabolic benefit at microdose is real and the side effects are negligible. There's no trophy for quitting entirely.", daysAgo: 48, reactions: { USEFUL: 9, AGREE: 5, LIKE: 4 } },
      { author: "sema_saturday", body: "I came off fully and kept weight. Took 6 weeks for appetite to fully return post-last-dose, which was the danger window. That's when I doubled down on tracking and meal structure. Once I got past that I was fine on behavioral control alone.", daysAgo: 47, reactions: { AGREE: 6, USEFUL: 4 } },
      { author: "plateau_breaker", body: "Key variable: do you know why you gained the weight originally? If it was life-stage (post-partum, medication, injury), the driver may be gone. If it was chronic behavioral, the behavior needs a full replacement or you'll drift back. The drug didn't fix the original cause, it masked it.", daysAgo: 46, reactions: { USEFUL: 14, AGREE: 10 } },
      { author: "dr_doubt", body: "@plateau_breaker this is the actual question. 'Will I rebound?' rephrased is 'has the original driver of my weight gain been resolved or just suppressed?' If suppressed, you will rebound. If resolved, you won't. The drug is orthogonal to that.", daysAgo: 46, reactions: { AGREE: 13, USEFUL: 8, LIKE: 5 } },
      { author: "goal_driven", body: "@plateau_breaker @dr_doubt this is the most useful framing I've gotten. My driver was honestly stress eating through a terrible job. Job is now gone. But the habit pattern isn't. I think I need to treat the post-sema period as 'behavioral work' not 'drug taper.'", daysAgo: 45, reactions: { AGREE: 7, LIKE: 6 } },
      { author: "hexaclinic", body: "Tapering sema over 16 weeks is not actually meaningfully different pharmacokinetically from stopping cold — half life is ~7 days, drug is mostly gone after 5-6 weeks regardless. The taper is a behavioral transition tool, not a pharmacologic one. Use the taper weeks to rebuild habits, not to ease off the drug.", daysAgo: 45, reactions: { USEFUL: 16, AGREE: 9 } },
      { author: "curious_catL", body: "Following. I'll be here in 8 months asking the same question. Bookmarked.", daysAgo: 42, reactions: { LIKE: 4 } },
    ],
  },

  // ============================================================
  // QUIET — 1 (Sema for metabolic, non-weight)
  // ============================================================
  {
    title: "Using sema purely for cravings / metabolic — not primarily weight loss",
    body: "35M, BMI 24, not trying to lose weight. Family history of T2D on both sides. Strong sugar cravings that survive every attempt at dietary control. Considering 0.25mg sema specifically for craving reduction and pre-diabetic prevention, not weight loss. Anyone here running this protocol? What to watch for given I don't want to lose much weight?",
    author: "late_bloomer_m",
    daysAgo: 35,
    views: 1420,
    reactions: { LIKE: 4, USEFUL: 2 },
    replies: [
      { author: "microdose_glp1", body: "0.15mg indefinitely here, same use case. Cravings evaporate. Lost 8lb and held it. If you don't want to lose weight you'll need to deliberately eat to maintenance — you'll just have to do it without the food noise pushing you. That's actually easier, not harder.", daysAgo: 34, reactions: { USEFUL: 6, LIKE: 3 } },
      { author: "hba1c_watch", body: "Recommend pulling full metabolic panel before and 90 days in. HbA1c, fasting glucose, fasting insulin, ApoB, hs-CRP. That's how you'll know if the use case is paying off beyond subjective craving reduction.", daysAgo: 33, reactions: { USEFUL: 7, AGREE: 3 } },
      { author: "fridge_protein", body: "At your BMI, muscle preservation matters more, not less. If you drop even 5lb and it's lean, that's a meaningful hit. Eat protein, lift.", daysAgo: 32, reactions: { AGREE: 4, USEFUL: 3 } },
    ],
  },

  // ============================================================
  // QUIET — 2 (Plateau-breaking)
  // ============================================================
  {
    title: "Stalled 11 weeks at 1.7mg — dose hold, step up, or switch to tirze?",
    body: "Weight flat for 11 weeks on 1.7mg sema. Same diet, same training. 5lb range oscillation but no net loss. Three options: 1) hold and wait, 2) step to 2.4, 3) switch to tirzepatide. Has anyone switched from stalled sema to tirze and seen new loss?",
    author: "plateau_breaker",
    daysAgo: 31,
    views: 1680,
    reactions: { LIKE: 6, USEFUL: 4 },
    replies: [
      { author: "tirzepatide_tim", body: "Switched at a similar stall point. Sema 1.7 -> tirze 7.5. Lost 11lb in the first 6 weeks on tirze. Dual mechanism (GIP+GLP-1) genuinely pulled where sema alone had plateaued. N=1 but it matches what others have reported.", daysAgo: 30, reactions: { USEFUL: 8, AGREE: 3 } },
      { author: "macrosguru", body: "Before switching drugs: what's your actual kcal intake? An 11-week stall at any GLP-1 is usually 'calories crept up' more than 'drug stopped working.' Log everything for 14 days to scale, then decide.", daysAgo: 30, reactions: { AGREE: 6, USEFUL: 5 } },
      { author: "sema_saturday", body: "I'd try a 2-week full break before switching. Sometimes receptors resensitize and the same dose works again after a pause. Cheaper than switching molecules.", daysAgo: 29, reactions: { USEFUL: 4, LIKE: 2 } },
      { author: "hexaclinic", body: "The 'stall' question almost always decomposes into: maintenance calories dropped with weight, and you haven't reduced intake to match. Your body at -50lb needs ~15-20% fewer kcal than at start. Drug suppressing appetite doesn't mean you're eating fewer calories than you burn at the new weight.", daysAgo: 28, reactions: { USEFUL: 11, AGREE: 7 } },
    ],
  },

  // ============================================================
  // QUIET — 3 (Compounded vs research chem)
  // ============================================================
  {
    title: "Pharmacy compounded sema vs research chem vials — quality / potency differences?",
    body: "Been on compounded sema from a US pharmacy for 7 months. Considering switching to research-labeled vials for cost. Has anyone noticed potency or consistency differences between the two sources? Skeptical the compounded product is actually superior given it's the same API, but curious if others have directly compared.",
    author: "cautious_ox",
    daysAgo: 27,
    views: 1380,
    reactions: { LIKE: 3, USEFUL: 3 },
    replies: [
      { author: "showmethestudy", body: "Third-party lab testing on research chem sema has shown wide variation in both potency and purity between vendors. Compounded pharmacy product at least has CoA and USP-grade water. That's what you're paying for, not the molecule.", daysAgo: 26, reactions: { USEFUL: 9, AGREE: 5 } },
      { author: "citation_required", body: "Plus one. Some research chem vials have tested at 60-80% of label claim. Others at 100%+. You don't know which one you got without independently testing it. If you're going to switch, budget for independent potency testing (Janoshik or similar) or accept the variance as part of the cost savings.", daysAgo: 26, reactions: { USEFUL: 7, AGREE: 4 } },
      { author: "protocolwonk", body: "Counter: some compounding pharmacies have had their own potency scandals. Compounded isn't automatically clean either. The variance exists in both channels, just at different rates.", daysAgo: 25, reactions: { AGREE: 4, USEFUL: 3 } },
    ],
  },

  // ============================================================
  // QUIET — 4 (HbA1c changes)
  // ============================================================
  {
    title: "HbA1c change on sema — post your before/after",
    body: "Curious about the distribution of A1c changes in people here. Me: 5.9 pre-sema, 5.3 after 6 months on 1.0mg. Fasting glucose 102 -> 88. I wasn't diabetic to begin with, pre-diabetic range. Would love to collect more data points.",
    author: "hba1c_watch",
    daysAgo: 44,
    views: 1240,
    reactions: { LIKE: 5, USEFUL: 3 },
    replies: [
      { author: "slow_lose", body: "5.7 -> 5.2 on 0.25mg over 8 months. Down 18lb. Mostly diet changes too so can't isolate the drug.", daysAgo: 43, reactions: { USEFUL: 3 } },
      { author: "microdose_glp1", body: "5.5 -> 5.2 on 0.15mg, 11 months. 13lb loss. Fasting insulin halved.", daysAgo: 43, reactions: { USEFUL: 3 } },
      { author: "apob_reader", body: "6.1 -> 5.4 on 1.0mg, 7 months. ApoB also came down 22 points. Lipid shift was the biggest surprise — expected glucose, didn't expect the cholesterol move.", daysAgo: 41, reactions: { USEFUL: 6, LIKE: 3 } },
      { author: "cbc_cmp", body: "5.4 -> 5.1 on 0.5mg, 4 months. Already in optimal range to start, margin was small. Still a real drop.", daysAgo: 39, reactions: { USEFUL: 2 } },
    ],
  },

  // ============================================================
  // QUIET — 5 (Eat to hunger debate)
  // ============================================================
  {
    title: "Eat to hunger or strict macro count on sema?",
    body: "Philosophy question. One camp says sema naturally creates a deficit — just eat when hungry and you'll lose at the right rate. Other camp says track macros rigorously or you'll under-eat protein and over-lose lean mass. Which side are you on and why?",
    author: "first_vial",
    daysAgo: 22,
    views: 1090,
    reactions: { LIKE: 4 },
    replies: [
      { author: "fridge_protein", body: "Track. Full stop. 'Eat to hunger' on a drug that suppresses hunger means eat 900 kcal with 45g protein. You will lose weight AND lose 40% of it as lean. Strict protein target + eat the rest to satiety is the compromise that works.", daysAgo: 21, reactions: { AGREE: 8, USEFUL: 5 } },
      { author: "macrosguru", body: "Protein as a hard floor, rest flexible. 180g protein/day non-negotiable, calories fall where they fall. That's the protocol.", daysAgo: 21, reactions: { AGREE: 6, USEFUL: 3 } },
      { author: "slow_lose", body: "I don't track anything and I'm fine. Losing 0.8lb/wk, strength holding. Not everyone needs the macro spreadsheet.", daysAgo: 19, reactions: { LIKE: 3, AGREE: 2 } },
    ],
  },

  // ============================================================
  // QUIET — 6 (Pregnancy / fertility)
  // ============================================================
  {
    title: "Pregnancy / fertility considerations — off-ramp timing before TTC?",
    body: "32F, on 1.0mg sema for 10 months. Partner and I want to start trying in 6 months. Looking for peer experiences on how long people wait after stopping sema before attempting to conceive. Label says 2 months minimum washout. Anyone waited longer / had discussions with OB about this?",
    author: "petal_push",
    daysAgo: 18,
    views: 980,
    reactions: { LIKE: 5, USEFUL: 2 },
    replies: [
      { author: "glp1_doctor_pt", body: "Not medical advice and I'm not your OB. Label is 2 months. Many providers use 3 months for cushion. The relevant clinical concern is tail-end drug exposure during early embryogenesis — animal data suggests risk. Discuss with your OB specifically, not a forum.", daysAgo: 17, reactions: { USEFUL: 7, AGREE: 4, THANKS: 3 } },
      { author: "hexaclinic", body: "Separate but relevant: weight loss from GLP-1 can restore ovulation in people who had anovulation from obesity. Some people get pregnant faster than expected. Have contraception sorted during and immediately after taper if TTC is 6+ months out.", daysAgo: 16, reactions: { USEFUL: 6, LIKE: 3 } },
      { author: "sema_saturday", body: "Friend in my circle came off sema, waited 3 months per her OB, conceived month 5 post-stop. Healthy pregnancy. N=1 anecdote but the 'wait a cycle past what label says' pattern is common.", daysAgo: 14, reactions: { LIKE: 3 } },
      { author: "cardinal_rule", body: "Locking this is not on the table but adding a note — this is one of those topics where the value of personalized medical guidance is much higher than forum consensus. Your OB, specifically, knows your whole picture. Use us for peer experience, not protocol.", daysAgo: 12, reactions: { AGREE: 7, USEFUL: 4 } },
    ],
  },
];

// ================================================================
// TIRZEPATIDE — 14 threads
// 3 popular (15-25 replies) + 5 active (6-12 replies) + 6 quiet (2-5 replies)
// ================================================================

export const THREADS_TIRZEPATIDE: SeedThread[] = [
  // ============================================================
  // POPULAR — 1
  // ============================================================
  {
    title: "5mg -> 10mg -> 15mg on tirze — how long at each step, who held where",
    body: "Tirze titration discussion, same energy as the sema thread but with its own wrinkles. Label is 4 weeks per step: 2.5 -> 5 -> 7.5 -> 10 -> 12.5 -> 15. Six steps, 20 weeks to max.\n\nMy experience: 41M, started 248lb, goal 190. Ran 2.5 for 4 weeks (basically no effect except mild nausea), 5 for 8 weeks (losing 2lb/wk, felt great), 7.5 for 6 weeks (loss slowed to 1lb/wk, pushed up). Currently 10mg for the last 10 weeks, down to 208, still losing ~1lb/wk.\n\nI'm debating 12.5 vs holding. Similar logic to sema — maybe the label ladder is a tolerability ramp, not an efficacy prescription.\n\nQuestions for the room:\n- Who made it to 15 and why?\n- Who held at 7.5 or 10 long-term?\n- Does the appetite suppression at 10 feel qualitatively different from sema 2.4, or is it comparable?",
    author: "tirzepatide_tim",
    daysAgo: 66,
    views: 7890,
    reactions: { LIKE: 20, USEFUL: 17, THANKS: 10, AGREE: 7 },
    replies: [
      { author: "plateau_breaker", body: "Made it to 15. Had to. 7.5 and 10 were fine for the first few months but loss flattened hard around month 7. 12.5 added a small push. 15 is where the food noise finally shuts up completely. I'm 5'11\" 225lb trying to get under 200 for the first time in 15 years. For some body types you need the top dose.", daysAgo: 65, reactions: { USEFUL: 11, AGREE: 6 } },
      { author: "cagrisema", body: "Held at 7.5 for 11 months. Lost 48lb. Side effect profile at 7.5 is the best risk/reward in my experience — the appetite suppression is real but the GI stuff is manageable. Pushing higher gave me nausea that wasn't worth the extra loss rate.", daysAgo: 65, reactions: { USEFUL: 10, AGREE: 5, LIKE: 4 } },
      { author: "sema_saturday", body: "Sema 2.4 felt like my stomach was 30% smaller all the time. Tirze 10 feels different — less 'stomach is full,' more 'I just don't think about food.' The GIP component seems to be doing cognitive/appetitive work that GLP-1 alone doesn't do. Anyone else feel this?", daysAgo: 64, reactions: { AGREE: 14, USEFUL: 8 } },
      { author: "tirzepatide_tim", body: "@sema_saturday yes — that matches my experience exactly. Sema was 'I'm full after 2 bites.' Tirze is 'I forgot to eat lunch.' Qualitatively different mechanism hitting.", daysAgo: 64, reactions: { AGREE: 9, USEFUL: 5 } },
      { author: "glp1_doctor_pt", body: "Important nuance: tirze has a 5-day half life and the 'peak' effect day is more spread out than sema's 2-4 day window. Titration tolerability is actually easier on tirze because the drug level plateau is smoother across the week.", daysAgo: 63, reactions: { USEFUL: 12, AGREE: 7, LIKE: 3 } },
      { author: "fat_loss_log", body: "Pro tip — when you step up on tirze, the nausea window is actually days 3-5 post first higher dose, not days 1-2. Plan the step-up injection for early in the week if you have a weekend obligation. Opposite of what people expect.", daysAgo: 62, reactions: { USEFUL: 9, AGREE: 4 } },
      { author: "dr_doubt", body: "The titration question is really a stopping-rule question in disguise. 'Should I go to 15?' = 'Is my current loss rate achieving my goal within my timeline?' If yes, don't. If no, and side effects are tolerable, yes. Stop asking 'which dose is best' and start asking 'which dose closes the gap to my goal.'", daysAgo: 61, reactions: { AGREE: 16, USEFUL: 11, LIKE: 6 } },
      { author: "hexaclinic", body: "People who need 15: typically higher start weight (>280lb), older (>50), or with significant insulin resistance. The GIP component is doing a lot of work on IR specifically, and at max dose you're saturating both receptors. If you don't have that pattern, 10 is usually plenty.", daysAgo: 61, reactions: { USEFUL: 13, AGREE: 8 } },
      { author: "macrosguru", body: "Held at 5 for my entire run. Lost 34lb over 14 months. Slow and boring but zero side effects at any point. If time isn't your constraint, low and slow on tirze is an extremely clean protocol.", daysAgo: 60, reactions: { LIKE: 8, AGREE: 4 } },
      { author: "slow_titrate", body: "Titrated even slower than label — 6 weeks per step. Hit max 30 weeks in. No nausea at any transition. Felt like cheating to have almost no side effect profile. 'Go slower than you think' is the single best piece of advice on this drug.", daysAgo: 58, reactions: { USEFUL: 11, AGREE: 7, LIKE: 5 } },
      { author: "wanderlite", body: "Two weeks into 2.5mg. Barely feel anything. Is that normal or should something be happening?", daysAgo: 56, reactions: { LIKE: 4 } },
      { author: "tirzepatide_tim", body: "@wanderlite totally normal. 2.5 for most people is subclinical — it's a tolerability stepping stone, not a therapeutic dose. Real movement typically starts at 5.", daysAgo: 56, reactions: { USEFUL: 6, THANKS: 4 } },
      { author: "plateau_breaker", body: "The dose-response curve on tirze is not linear. 2.5 is near-placebo. 5 is real. 10 is meaningfully more than 5. 15 is incrementally more than 10 for most. Don't evaluate the drug at 2.5.", daysAgo: 55, reactions: { USEFUL: 9, AGREE: 5 } },
      { author: "dexa_devotee", body: "DEXA at start (2.5), at 5, at 10, at maintenance dose. LBM loss as % of total loss was 18% at 5, 14% at 10, 22% at 15 (last 8 weeks). The 15 jump coincided with my protein intake dropping because appetite got too suppressed. Top dose requires more, not less, food discipline.", daysAgo: 54, reactions: { USEFUL: 14, AGREE: 7, LIKE: 4 } },
      { author: "protocolwonk", body: "@dexa_devotee that's a really clean dataset. The 'more food discipline at higher dose' framing is underrated. Higher dose doesn't mean you eat less and it's fine — it means you have to actively engineer intake because autopilot will underfeed you.", daysAgo: 53, reactions: { AGREE: 10, USEFUL: 6 } },
      { author: "taper_time", body: "Also worth noting — reverse titration off tirze takes longer than sema in my experience. The 5 day half life plus longer receptor adaptation means coming off 15 is a 4-6 month project if you want to do it right.", daysAgo: 51, reactions: { USEFUL: 7, AGREE: 3 } },
      { author: "citation_required", body: "SURPASS and SURMOUNT trials showed max weight loss continuing to accrue through week 72 on 15mg. So if you're going to use top dose, plan for 18+ months to see the full benefit. Most stop too early.", daysAgo: 49, reactions: { USEFUL: 10, AGREE: 6 } },
      { author: "reads_more_posts", body: "This thread is what makes me pay for this forum. Real N-of-many data from people who've actually run it.", daysAgo: 46, reactions: { LIKE: 9 } },
    ],
  },

  // ============================================================
  // POPULAR — 2
  // ============================================================
  {
    title: "Tirze vs sema — switching experiences and who should consider it",
    body: "Thread for people who've run both. What was the decision trigger to switch? How did the experience compare? Did you go back?\n\nMy story: 18 months on sema, hit a 14-week stall at 1.7mg despite tight tracking. Switched to tirze 5mg (equivalent-ish starting point). Within 4 weeks back to losing 1.5lb/wk. Side effect profile was actually BETTER on tirze in my case — fewer sulfur burps, less constipation, about the same nausea on step-up.\n\nBut I've also read from people for whom sema worked great and tirze added nothing — or was worse. What determined the difference?",
    author: "cagrisema",
    daysAgo: 51,
    views: 6540,
    reactions: { LIKE: 17, USEFUL: 13, THANKS: 6 },
    replies: [
      { author: "tirzepatide_tim", body: "Sema never did anything meaningful for me. 2.4 for 6 months, 9lb total. Switched to tirze, lost 32lb in the same 6-month window at 10mg. My body apparently needs the GIP arm. Some people are GLP-1 responders, some need both. You don't know which you are until you try.", daysAgo: 50, reactions: { USEFUL: 15, AGREE: 7 } },
      { author: "sema_saturday", body: "Opposite experience. Ran tirze 5 for 8 weeks after sema 1.0 plateaued, had worse nausea, same loss rate. Went back to sema 1.0 + slower eating pace and resumed losing. Not everyone needs the switch.", daysAgo: 50, reactions: { USEFUL: 8, AGREE: 4 } },
      { author: "plateau_breaker", body: "I switched for a different reason — availability. Sema supply was unreliable for about 4 months in my area, tirze was steady. Switched for logistics, stayed because it worked better subjectively.", daysAgo: 49, reactions: { LIKE: 5, USEFUL: 4 } },
      { author: "hexaclinic", body: "The mechanism-based heuristic: if you have strong metabolic dysfunction signals (high fasting insulin, high HOMA-IR, NAFLD, T2D), the GIP arm of tirze tends to add meaningful benefit. If your issue is purely behavioral/appetite and metabolic markers are normal, sema is usually sufficient and cheaper.", daysAgo: 49, reactions: { USEFUL: 19, AGREE: 11, LIKE: 6 } },
      { author: "glp1_doctor_pt", body: "Dose equivalence conversion people ask about: loose rule is tirze 5 ~ sema 1.0, tirze 10 ~ sema 2.0, tirze 15 ~ above sema max. Not exact, based on weight loss efficacy in head-to-head trials (SURMOUNT-5). Use it as a starting point, not a prescription.", daysAgo: 48, reactions: { USEFUL: 14, THANKS: 7 } },
      { author: "fat_loss_log", body: "Sulfur burp profile definitely different between the two. Sema gave me egg burps consistently. Tirze gives me nothing in that category. Mechanism probably related to gastric emptying kinetics differing slightly between the molecules.", daysAgo: 47, reactions: { AGREE: 6, USEFUL: 3 } },
      { author: "microdose_glp1", body: "Running microdose of both simultaneously as an experiment — 0.1mg sema + 1mg tirze weekly, split doses. Closer to once-every-3-days injection rhythm. Keeps both receptor systems lightly activated. Bloodwork is the best it's been in 10 years. N=1 and weird but I'll keep running it.", daysAgo: 46, reactions: { USEFUL: 8, LIKE: 5 } },
      { author: "showmethestudy", body: "@microdose_glp1 cool experiment but worth noting — there's no trial data on dual-drug GLP-1 use, so you're in full N=1 territory. No reason to think it's dangerous if both are at microdose but also no reason to think it's additive on the effect side either.", daysAgo: 46, reactions: { AGREE: 8, USEFUL: 4 } },
      { author: "cagrisema", body: "@hexaclinic your mechanism framing matches my experience — my fasting insulin was 19 pre-switch, HOMA-IR was 4.1. Tirze slammed those. Sema hadn't budged them meaningfully in 18 months.", daysAgo: 45, reactions: { AGREE: 6, USEFUL: 4 } },
      { author: "slow_lose", body: "Cost was my switch driver — compounded tirze was cheaper in my state than sema. Same weight loss rate, ~$80/mo less. Sometimes the decision is just economics.", daysAgo: 44, reactions: { LIKE: 5, USEFUL: 3 } },
      { author: "petal_push", body: "Can you switch mid-week or do you finish out a sema cycle first? Asking because I'm considering a switch and don't know if there's a washout needed.", daysAgo: 42, reactions: { LIKE: 2 } },
      { author: "hexaclinic", body: "@petal_push half-life overlap is fine — skip one sema week, take your first tirze dose on what would have been your sema day. No meaningful washout needed at the receptor level. Kinetics overlap is the feature not the bug.", daysAgo: 42, reactions: { USEFUL: 11, THANKS: 5 } },
      { author: "dr_doubt", body: "The 'switching' frame presumes one drug is 'better.' More accurate: different drugs work better for different phenotypes. The right question isn't 'is tirze better than sema' — it's 'what metabolic phenotype am I and which tool fits it.' Trial and error is your N=1 phenotyping.", daysAgo: 41, reactions: { AGREE: 17, USEFUL: 9, LIKE: 5 } },
      { author: "protocolwonk", body: "Add to this: starting dose matters when switching. Don't go from sema 2.4 to tirze 7.5 'equivalent' on day one — step up from tirze 2.5 or 5 as a buffer. Your GI tract is not identically adapted to the two drugs.", daysAgo: 40, reactions: { USEFUL: 10, AGREE: 7 } },
      { author: "cautious_ox", body: "This thread is my decision tree for the next 6 months. Saving every reply.", daysAgo: 36, reactions: { LIKE: 5, THANKS: 3 } },
      { author: "cardinal_rule", body: "Worth adding for the record: if you're deciding between these, insurance and prescriber access are real variables. The 'best' drug on paper that you can't afford consistently is worse than the 'second best' drug you can maintain for 18 months. Adherence is a molecule too.", daysAgo: 33, reactions: { AGREE: 13, USEFUL: 7 } },
    ],
  },

  // ============================================================
  // POPULAR — 3
  // ============================================================
  {
    title: "'Food noise' gone on tirze — the psychological experience nobody prepared me for",
    body: "I want to talk about what is genuinely a bigger story than the weight loss: my brain is quiet for the first time since I was probably 11 years old.\n\nI always assumed 'everyone thinks about food all day.' I was wrong. For 27 years I had a near-constant background process running: what's the next meal, is there snacks, can I justify it, am I hungry, am I bored, is it time yet. Tirze 7.5 shut that off at week 5. It was like a fan I didn't know was running went silent.\n\nThe feeling is not sadness or loss — it's LIBERATION. I have hours of cognitive bandwidth I didn't know I was spending. I finished reading a book last week for the first time in probably 4 years because I could actually concentrate.\n\nThe harder part: people who've never had food noise don't understand. Family members say 'you just need willpower.' They think I've been weak. I realize now I wasn't weak — I was running my brain with a constant background task they didn't have.\n\nWho else has experienced this? And what do you say to skeptics who think GLP-1 users are just taking the easy way out?",
    author: "fat_loss_log",
    daysAgo: 37,
    views: 8420,
    reactions: { LIKE: 29, AGREE: 24, THANKS: 12, USEFUL: 8 },
    replies: [
      { author: "plateau_breaker", body: "This post made me cry a little. I've been trying to explain this to my husband for months. 'Food noise' is the exact right phrase. He doesn't have it. He thinks food-thinking is optional. For me it wasn't. Until now.", daysAgo: 36, reactions: { AGREE: 18, LIKE: 11, THANKS: 6 } },
      { author: "sema_saturday", body: "This is the real story of GLP-1s and it doesn't fit in a before/after photo. The weight is downstream. The cognitive liberation is the primary effect.", daysAgo: 36, reactions: { AGREE: 16, LIKE: 9 } },
      { author: "tirzepatide_tim", body: "The 'willpower' argument drives me insane. If someone's brain chemistry is producing 5x more hunger/reward signal to food than normal, 'willpower' is asking them to constantly fight a neural signal everyone else doesn't have. It's not laziness. It's load.", daysAgo: 35, reactions: { AGREE: 22, LIKE: 10, USEFUL: 7 } },
      { author: "macrosguru", body: "The skeptic response is a version of 'I never had depression so depression is just sadness you could get over.' It's a failure to model that other people's brains are running different software.", daysAgo: 35, reactions: { AGREE: 19, LIKE: 8 } },
      { author: "hexaclinic", body: "The mechanism is real and documented. GLP-1 and GIP receptors in the mesolimbic reward system dampen food-related dopaminergic signaling. That's not 'willpower you're borrowing,' that's 'chemically normalized appetitive signal to match the food-abundant environment we evolved zero defenses against.'", daysAgo: 35, reactions: { USEFUL: 21, AGREE: 13, LIKE: 6 } },
      { author: "fat_loss_log", body: "@hexaclinic thank you. The 'food-abundant environment we evolved zero defenses against' is the sentence I'm going to use with skeptics from now on.", daysAgo: 34, reactions: { THANKS: 7, LIKE: 5 } },
      { author: "slow_lose", body: "My story is similar but smaller scale. I wouldn't say the food noise was debilitating pre-sema. But the difference post- is still significant. I think the magnitude of the relief correlates with how loud the noise was to begin with. For some of us it was DEAFENING.", daysAgo: 34, reactions: { AGREE: 11, USEFUL: 5 } },
      { author: "dr_doubt", body: "Two thoughts. 1) The 'easy way out' framing is moralizing health, which is always confused ethics. 2) There is no 'easy way' — you still have to lift, eat protein, track, engineer the lifestyle. The drug removes one specific biological barrier. The rest of the work remains.", daysAgo: 33, reactions: { AGREE: 20, USEFUL: 11, LIKE: 7 } },
      { author: "wanderlite", body: "I'm 8 weeks in and just starting to notice this. I was crying at my kitchen counter yesterday because I realized I could walk past the snack drawer without planning a complicated detour. I had no idea how much energy that was taking.", daysAgo: 32, reactions: { LIKE: 14, THANKS: 8, AGREE: 5 } },
      { author: "cagrisema", body: "The cagrisema stack (adding cagrilintide) takes the food noise reduction to another level. If you thought tirze alone was quiet, cagri on top is functionally silent. Overkill for most but for people with very high baseline noise it's been a revelation.", daysAgo: 32, reactions: { USEFUL: 8, LIKE: 4 } },
      { author: "showmethestudy", body: "Flag for the thread — the cognitive effects are real but 'food noise' is a subjective measure and not all of the relief is direct drug effect. Some is downstream of weight loss itself, blood glucose stabilization, reduced inflammation. Tough to disentangle. Doesn't diminish the experience, just complicates the mechanism claim.", daysAgo: 31, reactions: { AGREE: 9, USEFUL: 6 } },
      { author: "curious_catL", body: "I keep trying to explain this to my mother who's convinced I should 'just eat less.' Sharing this thread with her. Maybe someone else's words will land where mine haven't.", daysAgo: 30, reactions: { LIKE: 8, THANKS: 4 } },
      { author: "quietstorm", body: "Less discussed — the first time food noise returned for me was during a supply gap. Three weeks without a dose and the mental chatter came back like an FM station you thought was broken. Confirmed for me what I'd been experiencing was real, not placebo.", daysAgo: 29, reactions: { USEFUL: 12, AGREE: 7, LIKE: 4 } },
      { author: "late_bloomer_m", body: "Reading this thread at 2am and crying quietly. I thought I was uniquely broken. Apparently I was just a statistically normal GLP-1 responder and didn't know.", daysAgo: 28, reactions: { LIKE: 15, THANKS: 8, AGREE: 5 } },
      { author: "reads_more_posts", body: "The reply chain here is more valuable than any clinical summary. Save this thread.", daysAgo: 25, reactions: { LIKE: 10, AGREE: 3 } },
      { author: "reggae_fiend", body: "Long-time user here. The weight comes back quickly if you stop. The cognitive quiet lingers for 4-6 weeks post-dose for me. That tail is under-studied and fascinating.", daysAgo: 22, reactions: { USEFUL: 8, LIKE: 4 } },
      { author: "nopain_noreign", body: "Best thread on this forum in months. Changes the conversation from 'weight loss drug' to 'neurological intervention with weight as side effect.'", daysAgo: 18, reactions: { AGREE: 14, LIKE: 9 } },
    ],
  },

  // ============================================================
  // ACTIVE — 1 (Compounded tirze quality)
  // ============================================================
  {
    title: "Compounded tirze quality complaints — who's experienced batch inconsistency",
    body: "On my 4th vial from the same compounding pharmacy and this one feels different. First 3 gave me mild appetite suppression lasting ~5 days post-injection. This latest vial — nothing. Three weeks in, no nausea, no appetite change, no loss. Either I'm tachyphylactic after 14 weeks or this vial is under-dosed.\n\nAnyone else had this? What's the recourse? Is there independent testing people use?",
    author: "citation_required",
    daysAgo: 33,
    views: 2960,
    reactions: { LIKE: 6, USEFUL: 5 },
    replies: [
      { author: "cyclecraft", body: "Janoshik Analytical for independent potency testing. Send a sample with a control from an unopened new vial, request tirzepatide content quantitation. Costs about $75. Worth it when the stakes are 'is the drug I'm putting in my body real.'", daysAgo: 32, reactions: { USEFUL: 11, AGREE: 5 } },
      { author: "protocolwonk", body: "I've seen three separate posters describe this pattern with specific pharmacies (mine included) over the last 6 months. The compounded tirze market is not as controlled as the branded supply chain. Batch variation is a known problem. You are not imagining it.", daysAgo: 32, reactions: { USEFUL: 9, AGREE: 6 } },
      { author: "tirzepatide_tim", body: "Contact the pharmacy. They will often send a replacement if you describe the symptom pattern clearly and professionally. 'Four consecutive vials, this one is the outlier, I'd like a replacement or an explanation.' Don't start angry.", daysAgo: 31, reactions: { USEFUL: 7, LIKE: 3 } },
      { author: "showmethestudy", body: "Tachyphylaxis on tirze at 14 weeks is possible but atypical. The symptom of 'entirely absent effect' points more at drug-side issue than biology-side. Tachyphylaxis would present as reduced effect, not zero effect.", daysAgo: 31, reactions: { USEFUL: 6, AGREE: 4 } },
      { author: "citation_required", body: "Update — sent sample to Janoshik, results came back at 61% of label claim. Contacted pharmacy with the report. They're replacing the entire remaining supply and apologized. Lesson: test your meds when something feels off.", daysAgo: 25, reactions: { USEFUL: 18, THANKS: 9, LIKE: 7 } },
      { author: "cardinal_rule", body: "Great outcome and exactly how this kind of thing should be handled — test, document, communicate, resolve. Flagging citation_required's follow-through as the template for how to respond when you suspect batch issues.", daysAgo: 24, reactions: { AGREE: 8, USEFUL: 5, LIKE: 3 } },
      { author: "stackbuilder", body: "Saving this. 'Test when something feels off' is underused advice across every peptide category. People will second-guess themselves for 6 weeks when a $75 test settles it.", daysAgo: 22, reactions: { AGREE: 6, USEFUL: 3 } },
    ],
  },

  // ============================================================
  // ACTIVE — 2 (Lean mass preservation on tirze)
  // ============================================================
  {
    title: "Lean mass preservation on tirze — it's more aggressive than sema, is protein enough?",
    body: "Tirze's weight loss rate at higher doses is significantly faster than sema for many people. That raises the lean mass preservation stakes. If I lose 3lb/wk for 4 months, I'm pulling lean mass faster than sema at 2.4 doing 1.5lb/wk over the same period.\n\nAre people running higher protein (1.2g/lb?) on tirze specifically, or is the sema playbook (1g/lb, lift 3x/wk) still sufficient?",
    author: "dexa_devotee",
    daysAgo: 40,
    views: 2640,
    reactions: { LIKE: 8, USEFUL: 6 },
    replies: [
      { author: "fridge_protein", body: "Same protein target (1g/lb goal weight). The lever that should change is training volume, not protein. Faster weight loss = harder recovery = reduce total sets, not increase them. But absolutely maintain the protein floor. Protein need is dose-of-deficit, not dose-of-drug.", daysAgo: 40, reactions: { USEFUL: 11, AGREE: 7 } },
      { author: "nopain_noreign", body: "Cap rate of loss to manage lean preservation. If you're dropping >1.5% bw/week sustained, your body is going to take some of that from muscle regardless of protein. Slow the drug or raise calories until you're back under 1%. That's the real protection, not more scoops of whey.", daysAgo: 39, reactions: { USEFUL: 14, AGREE: 10, LIKE: 5 } },
      { author: "plateau_breaker", body: "@nopain_noreign this is the correct answer. 'Eat more protein' is a floor, but the ceiling on lean preservation is controlled by deficit size. You cannot out-protein a 1500 kcal deficit.", daysAgo: 39, reactions: { AGREE: 9, USEFUL: 5 } },
      { author: "dexa_devotee", body: "Pulled my serial DEXA data — LBM loss scales with weekly rate of total loss much more than with absolute protein intake (everyone I'm comparing was 0.9g+ per lb goal). People losing 2lb+/wk on tirze lost 22-30% of that as lean. People losing 1lb/wk lost 10-15% as lean. Rate is the lever.", daysAgo: 38, reactions: { USEFUL: 15, AGREE: 8, LIKE: 5 } },
      { author: "recomp_rex", body: "Creatine 5g, protein 0.9g/lb goal weight, resistance train 2-3x/wk, cap loss at 1% bw/week. That's the non-negotiable protocol on any GLP-1. Everything else is optimization.", daysAgo: 37, reactions: { AGREE: 12, USEFUL: 8 } },
      { author: "hexaclinic", body: "Add: don't drop training weight. Most people on fast loss drop their working sets by 20-30% because they 'feel weak.' If you can still rep the same weight, rep it — preserving strength preserves neurological drive and protects against muscle atrophy even when calories are tight.", daysAgo: 36, reactions: { USEFUL: 13, AGREE: 7, LIKE: 4 } },
      { author: "wanderlite", body: "What's 1% bw/week actually look like for a 250lb person?", daysAgo: 34, reactions: { LIKE: 2 } },
      { author: "recomp_rex", body: "@wanderlite 2.5lb/wk, ~10lb/mo. That's the upper bound you want. Above that and lean mass loss accelerates. Below that for most people is sustainable.", daysAgo: 34, reactions: { USEFUL: 6, THANKS: 3 } },
    ],
  },

  // ============================================================
  // ACTIVE — 3 (Gallstones)
  // ============================================================
  {
    title: "Gallstones on GLP-1s — anyone here had a GB issue during treatment?",
    body: "Risk thread. Rapid weight loss + slowed gastric emptying + cholestasis = elevated gallstone risk. The GLP-1 trials showed ~2-3x the background rate. I've had two acquaintances have emergency cholecystectomies while on tirze.\n\nWho here has had a gallbladder issue during GLP-1 treatment? Symptoms? Imaging? Did you continue or stop the drug?\n\nAnd preventatively — anyone running TUDCA, ursodiol, or other bile-flow agents alongside to reduce risk?",
    author: "hexaclinic",
    daysAgo: 48,
    views: 3240,
    reactions: { LIKE: 8, USEFUL: 7, AGREE: 3 },
    replies: [
      { author: "fridge_protein", body: "Had gallstones at month 8 on tirze. Started with upper right quadrant ache post-meal, progressed over 3 weeks to sharp pain and nausea. Ultrasound confirmed. Elective cholecystectomy. Stayed off tirze 6 weeks post-op, back on at lower dose. The GB was probably pre-existing and the rapid loss tipped it into symptomatic.", daysAgo: 47, reactions: { USEFUL: 13, THANKS: 5 } },
      { author: "glp1_doctor_pt", body: "Prophylactic ursodiol (UDCA) 300mg twice daily during active weight loss has been studied in bariatric surgery populations with meaningful reduction in stone formation. Not standard of care for GLP-1 users but some providers prescribe it for high-risk patients. Worth asking your doctor if you have a family history or a prior sludge finding.", daysAgo: 47, reactions: { USEFUL: 15, AGREE: 8, THANKS: 5 } },
      { author: "apob_reader", body: "TUDCA 500mg daily, running for 14 months on tirze. No stones on ultrasound at the 12-month check. N=1, not a clinical trial, but it's a reasonable adjunct if you're not prescribed UDCA. Cheaper too.", daysAgo: 46, reactions: { USEFUL: 9, LIKE: 4 } },
      { author: "plateau_breaker", body: "Symptom hierarchy that got me to the ER: constant RUQ pain (not intermittent), referred pain to right shoulder, dark urine, pale stool. First three red flags on my weight loss journey in 18 months. Don't ignore RUQ pain that lingers more than 2-3 days.", daysAgo: 45, reactions: { USEFUL: 14, AGREE: 6, THANKS: 4 } },
      { author: "cautious_ox", body: "Had sludge (pre-stone) found on a routine abdominal ultrasound 5 months into sema. My doctor put me on UDCA and I haven't progressed. Kept on sema. Ultrasound every 6 months as monitoring.", daysAgo: 44, reactions: { USEFUL: 8, LIKE: 3 } },
      { author: "showmethestudy", body: "The gallstone risk is real but the absolute numbers are still low. Baseline rate ~0.5-1% per year in middle-aged adults, GLP-1 bumps that ~2-3x = 1.5-3% per year. Most people won't have problems. But 'low absolute risk' is not 'zero,' and if you have family history or known risk factors, the risk-benefit shifts.", daysAgo: 43, reactions: { USEFUL: 11, AGREE: 7 } },
      { author: "hexaclinic", body: "Appreciate all replies. Key takeaways for the thread: 1) RUQ pain post-meal + nausea = ultrasound, don't wait. 2) UDCA or TUDCA prophylaxis is reasonable for higher-risk patients. 3) Baseline abdominal ultrasound before starting is a cheap and valuable data point. Pin this list somewhere.", daysAgo: 42, reactions: { USEFUL: 14, AGREE: 8, THANKS: 5 } },
      { author: "quietstorm", body: "Small point — slowing down weight loss when you have known sludge also reduces stone progression. The rate of loss is the driver, not the weight loss itself. Holding at current weight for 2-3 months can let sludge clear on its own.", daysAgo: 40, reactions: { USEFUL: 7, AGREE: 3 } },
    ],
  },

  // ============================================================
  // ACTIVE — 4 (Tirze for T2D)
  // ============================================================
  {
    title: "Tirze for T2D specifically — metformin + tirze stack experiences",
    body: "T2D for 11 years, A1c had crept back to 7.2 on metformin 2000mg alone. Endo added tirze 3 months ago. A1c down to 6.1 at re-check. Weight came off as a bonus (14lb).\n\nCurious about others running this combo — how long on stack, A1c trajectory, any dose adjustment to metformin? My endo wants to keep metformin for the long-term kidney benefits even if tirze is doing the main glucose work.",
    author: "hba1c_watch",
    daysAgo: 42,
    views: 2180,
    reactions: { LIKE: 7, USEFUL: 5, AGREE: 2 },
    replies: [
      { author: "cbc_cmp", body: "Met 1500 + tirze 7.5 for 14 months. A1c 7.8 -> 5.9, fasting 158 -> 104, weight down 28lb. Endo left metformin alone for the reasons yours cited — cardioprotective / kidney-protective signal is independent of glucose control. Don't drop it just because glucose is fixed.", daysAgo: 41, reactions: { USEFUL: 10, AGREE: 5 } },
      { author: "glp1_doctor_pt", body: "The metformin + tirze combo is one of the cleanest modern T2D stacks. Metformin for long-term all-cause mortality signal, tirze for glucose + weight + cardiovascular endpoints. Synergistic on glucose, non-overlapping on the ancillary benefits. Don't de-prescribe either unless you have a specific reason.", daysAgo: 41, reactions: { USEFUL: 14, AGREE: 8, THANKS: 4 } },
      { author: "apob_reader", body: "Running both + empagliflozin (SGLT2i). A1c 8.1 -> 5.4 in 9 months. My cardiologist is happy, my endo is happy, I'm happy. The triple combo is the modern T2D protocol in my view and I wish I'd been on it 5 years ago.", daysAgo: 39, reactions: { USEFUL: 11, AGREE: 4, LIKE: 3 } },
      { author: "showmethestudy", body: "Tirze as monotherapy for T2D is supported by SURPASS-1 data but most real-world use is as add-on to metformin. Combination has the best evidence base for long-term outcomes. The 'should I drop metformin' question almost always has the answer 'no' unless you're having GI issues from it.", daysAgo: 38, reactions: { USEFUL: 9, AGREE: 5 } },
      { author: "hba1c_watch", body: "Thanks all. Keeping metformin. Planning to retest at 6 months and post an update. The A1c trajectory in 3 months already beat anything I saw in 11 years of metformin alone.", daysAgo: 37, reactions: { LIKE: 5, THANKS: 3 } },
      { author: "hexaclinic", body: "Worth tracking fasting insulin and HOMA-IR too, not just A1c. A1c is average glucose but insulin dynamics tell you about the underlying driver. Seeing those two numbers normalize is the real win.", daysAgo: 36, reactions: { USEFUL: 7, AGREE: 3 } },
    ],
  },

  // ============================================================
  // ACTIVE — 5 (2.5mg maintenance microdose)
  // ============================================================
  {
    title: "2.5mg tirze as maintenance after goal weight — anyone running this long term?",
    body: "Hit goal weight at 165lb (from 214). Currently at 10mg. Plan is to step down to 5, then maintenance at 2.5mg indefinitely rather than come fully off. Logic: 2.5 is below the therapeutic weight-loss threshold but still delivers meaningful appetite suppression and metabolic benefit. Should prevent rebound without any of the fast-loss dynamics.\n\nAnyone actually running 2.5 as indefinite maintenance? How long?",
    author: "taper_time",
    daysAgo: 29,
    views: 1820,
    reactions: { LIKE: 6, USEFUL: 4 },
    replies: [
      { author: "slow_titrate", body: "2.5 maintenance, 18 months. Weight stable within 3lb. Side effects basically zero. Monthly cost reasonable. Best decision I made was not trying to come off fully.", daysAgo: 28, reactions: { USEFUL: 9, AGREE: 5, LIKE: 3 } },
      { author: "microdose_glp1", body: "Running 2mg tirze weekly (lower than 2.5) for similar reasons. Maintenance is easier at below-therapeutic dose because you're not trying to suppress appetite aggressively — you're just keeping the metabolic signal on.", daysAgo: 27, reactions: { USEFUL: 7, LIKE: 3 } },
      { author: "glp1_doctor_pt", body: "The 'maintenance microdose' approach is increasingly discussed among providers. Not label, but plausible mechanism, and avoids the STEP-4 / SURMOUNT-4 style rebound that occurred in cohorts that came fully off. The counterargument is indefinite drug exposure — long-term safety on chronic low-dose is still being established.", daysAgo: 26, reactions: { USEFUL: 11, AGREE: 6 } },
      { author: "cagrisema", body: "Stacking 2.5 tirze with microdose cagrilintide (0.5mg weekly) for maintenance has been my setup for 8 months. The amylin component further smooths satiety. If you're going to stay on something indefinitely, might as well pick a clean dual-agonist approach.", daysAgo: 25, reactions: { USEFUL: 6 } },
      { author: "showmethestudy", body: "No long-term data on chronic low-dose GLP-1/GIP exposure beyond ~5 years. Everyone running indefinite maintenance is in post-trial territory. The choice is reasonable, just state it as 'less data here than active-phase dosing.'", daysAgo: 24, reactions: { AGREE: 7, USEFUL: 4 } },
      { author: "dr_doubt", body: "The real question is what you're optimizing for. If lifetime weight regulation and the drug has a favorable safety profile at low dose, indefinite maintenance may be appropriate. If you're philosophically committed to 'off all drugs' as an endpoint, you'll need to build a behavioral protocol that replaces what the drug was doing — and that's a bigger project than most people bargain for.", daysAgo: 22, reactions: { AGREE: 12, USEFUL: 6, LIKE: 4 } },
    ],
  },

  // ============================================================
  // QUIET — 1 (Injection site)
  // ============================================================
  {
    title: "Injection site rotation on tirze — abdomen vs thigh, does it matter?",
    body: "New to tirze, week 3. Have been injecting abdomen exclusively. Is thigh equivalent or are there absorption / comfort differences?",
    author: "syringe_shy",
    daysAgo: 19,
    views: 890,
    reactions: { LIKE: 3 },
    replies: [
      { author: "cyclecraft", body: "Both work. Abdomen tends to have slightly faster absorption due to higher vascularity, thigh is slower and more gradual. For weekly dosing this is clinically irrelevant — total AUC is basically the same. Use whichever is more comfortable.", daysAgo: 19, reactions: { USEFUL: 7, AGREE: 4 } },
      { author: "stackbuilder", body: "Rotate both. I do abdomen three weeks, thigh one week, cycle. Keeps any single area from getting lumpy / bruised. Also you'll want the flexibility if you ever develop an injection reaction in one area.", daysAgo: 18, reactions: { USEFUL: 5 } },
      { author: "tirzepatide_tim", body: "Back of arm works too if you have someone to help. Not a daily option but a 'travel and don't want to expose abdomen' option.", daysAgo: 17, reactions: { LIKE: 3 } },
    ],
  },

  // ============================================================
  // QUIET — 2 (Pancreatitis fear)
  // ============================================================
  {
    title: "Pancreatitis fear — what symptoms actually warrant worry?",
    body: "I keep reading about pancreatitis risk on GLP-1s. Every minor upper abdominal twinge is making me anxious. What are the actual red-flag symptoms vs normal tirze GI discomfort?",
    author: "cautious_ox",
    daysAgo: 25,
    views: 1140,
    reactions: { LIKE: 4, USEFUL: 2 },
    replies: [
      { author: "hexaclinic", body: "Red flags: severe persistent pain in the central upper abdomen radiating to the back, that gets WORSE with eating (not better), paired with nausea/vomiting that won't resolve. That's go-to-the-ER pattern. Normal tirze discomfort is intermittent, meal-related, resolves within hours, does not radiate to the back.", daysAgo: 24, reactions: { USEFUL: 12, AGREE: 6, THANKS: 4 } },
      { author: "glp1_doctor_pt", body: "If worried, baseline + periodic lipase and amylase. Mild elevations are common on GLP-1s and don't mean pancreatitis. 3x+ upper limit of normal paired with clinical symptoms is the concerning pattern. Labs without symptoms are rarely actionable.", daysAgo: 24, reactions: { USEFUL: 9, AGREE: 4 } },
      { author: "showmethestudy", body: "Absolute risk of pancreatitis on GLP-1s is low (<0.5% per year in most analyses). Higher than background but not common. Worth awareness, not worth daily anxiety.", daysAgo: 22, reactions: { USEFUL: 7, AGREE: 3 } },
    ],
  },

  // ============================================================
  // QUIET — 3 (Tirze cost / suppliers)
  // ============================================================
  {
    title: "Tirze cost — comparing suppliers, what are people paying",
    body: "Cost check. I'm paying $180/mo for compounded tirze at current dose. Feels high. What are people in different channels paying per month at ~7.5-10mg equivalent?",
    author: "weekendwarrior_p",
    daysAgo: 16,
    views: 1280,
    reactions: { LIKE: 4 },
    replies: [
      { author: "sema_saturday", body: "$160 for 10mg compounded through telehealth. Shopped around — range I saw was $130-$250. The spread is real.", daysAgo: 15, reactions: { USEFUL: 4 } },
      { author: "plateau_breaker", body: "$140/mo at current dose. Switched pharmacies after 6 months because my original was 40% more for the same product.", daysAgo: 15, reactions: { USEFUL: 3 } },
      { author: "slow_lose", body: "Research channel <$60/mo for 10mg equivalent. Higher variance, less oversight. You save money and accept the trade-off. I've had good luck over 18 months.", daysAgo: 14, reactions: { LIKE: 2, USEFUL: 2 } },
      { author: "cardinal_rule", body: "Heads up — pricing discussions are fine, vendor names are not per forum rules. If someone DMs for vendor, decline. This isn't LabTalk.", daysAgo: 13, reactions: { AGREE: 6, USEFUL: 3 } },
    ],
  },

  // ============================================================
  // QUIET — 4 (Tirze on travel days)
  // ============================================================
  {
    title: "Tirze injection on travel days — reschedule or hold?",
    body: "Leaving on a 10-day international trip. Normal injection day falls 2 days in. Is it better to dose early before leaving, dose late after return, or stick to schedule mid-trip? Concerned about airport food reactions and unfamiliar bathrooms.",
    author: "thread_saver",
    daysAgo: 14,
    views: 760,
    reactions: { LIKE: 3 },
    replies: [
      { author: "plateau_breaker", body: "Dose 2 days early before leaving. Peak nausea days will then be days 2-4 of travel which is usually when you've arrived and are eating hotel food. Worst case you skip a dinner. Better than being stuck in a plane bathroom at peak.", daysAgo: 13, reactions: { USEFUL: 7, AGREE: 4 } },
      { author: "tirzepatide_tim", body: "Other option — delay a week until you're back. Skipping one week is fine, tirze has a 5-day half-life and you'll still have drug on board. Just don't drink alcohol like you're off the drug during the skip week.", daysAgo: 13, reactions: { USEFUL: 6, LIKE: 3 } },
      { author: "wanderlite", body: "Doing this next month. Good timing on the thread.", daysAgo: 11, reactions: { LIKE: 2 } },
    ],
  },

  // ============================================================
  // QUIET — 5 (Cagrisema)
  // ============================================================
  {
    title: "Cagrisema stack — running cagrilintide alongside tirze, early experiences",
    body: "Cagrilintide (amylin analog) is approaching approval separately and some people are already stacking it with tirze. Theoretical synergy — amylin + GLP-1 + GIP covering three satiety pathways. Who's running this and what's the dose setup?",
    author: "cagrisema",
    daysAgo: 24,
    views: 1540,
    reactions: { LIKE: 5, USEFUL: 3 },
    replies: [
      { author: "tirzepatide_tim", body: "6 months running tirze 7.5 + cagri 2.4 weekly. Loss rate is faster than tirze alone and the food-noise floor is lower than anything I've experienced. Side effects manageable — the cagri adds some early satiety but no new categories of issue.", daysAgo: 23, reactions: { USEFUL: 8, LIKE: 3 } },
      { author: "slow_titrate", body: "Lower doses on both — 5mg tirze + 1mg cagri. The combo lets you use sub-therapeutic doses of each and still get meaningful effect. Total drug load is lower for same outcome. I think this will be the future of multi-pathway GLP-1 protocols.", daysAgo: 22, reactions: { USEFUL: 7, AGREE: 4 } },
      { author: "showmethestudy", body: "Worth flagging — no real-world safety data on this specific combination beyond trial settings. CagriSema trials exist for that combo specifically. Cagri + tirze is even less studied. Proceed with appropriate caution on the N=1 interpretation.", daysAgo: 21, reactions: { AGREE: 6, USEFUL: 4 } },
      { author: "hexaclinic", body: "The amylin mechanism is genuinely additive — it works on different neurons than GLP-1/GIP. Mechanism story is coherent, safety story is early days. This is the 'try a small dose, watch carefully' class of stack.", daysAgo: 20, reactions: { USEFUL: 8, AGREE: 4 } },
    ],
  },

  // ============================================================
  // QUIET — 6 (Bariatric alternative)
  // ============================================================
  {
    title: "Skipped bariatric surgery for tirze — anyone else make this call?",
    body: "Was scheduled for sleeve gastrectomy last year. Consulted for the pre-op workup, got cold feet (family member had complications), pivoted to tirze instead. Down 67lb in 14 months, now at what would have been my 2-year post-op surgical goal weight. Without surgery. Anyone else in this boat?",
    author: "reclusive_rn",
    daysAgo: 21,
    views: 1820,
    reactions: { LIKE: 7, USEFUL: 3, THANKS: 2 },
    replies: [
      { author: "plateau_breaker", body: "Same story. Was 6 weeks out from RNY. Switched to tirze after reading SURMOUNT-1 results. 18 months later at 94lb down. My surgeon was honest with me — said 'the results you're describing are competitive with what we'd have gotten.' Not everyone's surgeon would say that.", daysAgo: 20, reactions: { USEFUL: 10, LIKE: 5 } },
      { author: "sema_saturday", body: "The calculus shifted when GLP-1s got this effective. Surgery is irreversible, has a ~1% serious complication rate, and requires lifelong vitamin supplementation. If a drug gets you 80% of the weight loss with reversibility and no surgical risk, the comparison gets harder to justify surgery.", daysAgo: 19, reactions: { AGREE: 8, USEFUL: 5 } },
      { author: "hexaclinic", body: "One important distinction — surgery metabolic effects (especially for T2D remission) are partly independent of weight loss. Some patients achieve diabetes remission from surgery that drugs don't replicate. If T2D is the driver, surgery still has a specific place. If it's weight alone, drugs have narrowed the gap dramatically.", daysAgo: 18, reactions: { USEFUL: 11, AGREE: 6 } },
      { author: "dr_doubt", body: "The honest comparison: surgery is a one-time commitment, drug is an indefinite commitment. Both have cost structures, both have risk profiles, both have maintenance requirements. 'Skipped surgery for tirze' is really 'chose ongoing pharmacologic intervention over one-time surgical intervention.' Neither is a free option.", daysAgo: 17, reactions: { AGREE: 9, USEFUL: 5 } },
      { author: "reclusive_rn", body: "@dr_doubt fair framing. I'd add — for me the reversibility was the deciding factor. If tirze stopped working or I couldn't access it, I could still have surgery. The reverse isn't true. Option value matters.", daysAgo: 17, reactions: { AGREE: 6, USEFUL: 3 } },
    ],
  },
];
