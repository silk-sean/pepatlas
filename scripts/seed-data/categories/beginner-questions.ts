import type { SeedThread } from "../types";

export const THREADS_BEGINNER: SeedThread[] = [
  // ============================================================
  // PINNED — mod post, older, lots of replies over time
  // ============================================================
  {
    title: "READ THIS BEFORE YOUR FIRST POST — beginner FAQ + how to ask a good question",
    body: `Hey everyone. This is pinned so it stays at the top. If you're new, please skim this before opening a new thread — 90% of "is this safe" / "am I doing it right" questions are covered here, and you'll get way better answers if you ask with the right info up front.

**Before you ask a question, include:**
- Compound + dose + frequency (e.g. "BPC-157, 250mcg SubQ 2x/day")
- How long you've been on it
- Your goal (healing a specific injury, sleep, body recomp, etc.)
- Age / sex / rough training or activity level (optional but helps)
- What you already tried / researched

**Basics most new people get wrong:**
1. **Reconstitution math**: mg on the vial / mL of bac water you add = concentration per mL. Then divide by insulin syringe units (100 units = 1mL on a U-100 syringe). Use a calculator, there are free ones everywhere.
2. **SubQ vs IM**: most research peptides are SubQ. You do not need to IM BPC or TB500. Stop stabbing your glutes.
3. **Bac water is cheap. Don't reuse sketchy vials.** Once reconstituted, refrigerate. Most peptides are stable in the fridge for 30 days, some shorter (GHK-Cu, thymosins are a bit more fragile).
4. **Start low.** The standard rookie mistake is "I'll just run the max dose I saw in a study." Studies are on rats or in patients with specific conditions. Titrate.
5. **One variable at a time.** If you stack 4 things week 1 and feel weird, you have no idea which one did it.

**Things we're tired of arguing about:**
- "Is [supplier] legit?" — read the supplier threads, don't name-drop in open forum, DM someone.
- "Can I mix X and Y in the same syringe?" — sometimes yes, sometimes you'll waste your peptide. Ask in the relevant thread.
- "Will this show on a drug test?" — peptides generally don't show on standard panels but some (GH secretagogues, GLP-1s) absolutely flag on specific tests. If you're tested for work/sport, assume yes.

Ask freely. There are no dumb questions, only dumb protocols. Welcome.`,
    author: "cardinal_rule",
    daysAgo: 148,
    pinned: true,
    views: 8420,
    reactions: { LIKE: 14, USEFUL: 15, THANKS: 12, AGREE: 8 },
    replies: [
      {
        author: "lucidverse",
        body: `Co-signed. Adding one thing: if you paste a screenshot of a supplier's product page and ask "is this real?" — we literally cannot tell from the photo. COA or it didn't happen.`,
        daysAgo: 148,
        reactions: { AGREE: 9, LIKE: 5 },
      },
      {
        author: "hexaclinic",
        body: `Good pin. One nuance on #3 — GHK-Cu specifically, some people freeze in aliquots if they're running a long course. I do 5x 0.5mL aliquots in sterile vials and pull one out every ~5 days. Overkill for most but it's what I do.`,
        daysAgo: 146,
        reactions: { USEFUL: 7, LIKE: 3 },
      },
      {
        author: "new2peptides",
        body: `Bookmarking. Literally was about to ask about IM vs SubQ. Saved me.`,
        daysAgo: 140,
        reactions: { LIKE: 4 },
      },
      {
        author: "dr_doubt",
        body: `Strong pin. I'd add: "how long until I feel something" depends entirely on the compound. BPC for a tendon? weeks. Selank? often same day. Reta for fat loss? titration takes months. Patience is the cheapest stack component.`,
        daysAgo: 138,
        reactions: { AGREE: 11, USEFUL: 6 },
      },
      {
        author: "syringe_shy",
        body: `Can we get a sticky calculator link? the one I used last week gave me a weird answer and I had to re-do it three times`,
        daysAgo: 135,
      },
      {
        author: "cardinal_rule",
        body: `@syringe_shy — there's one in the resources section. Also honestly, do the math by hand once so you understand what the calculator is doing. If you can't do it by hand, don't trust the calculator.`,
        daysAgo: 135,
        reactions: { AGREE: 8, USEFUL: 4 },
      },
      {
        author: "protocolpilot",
        body: `+1 on "one variable at a time." I can't count how many times I've seen someone start BPC + TB500 + ipamorelin + NAD all on the same Monday and then ask why they feel weird.`,
        daysAgo: 130,
        reactions: { FUNNY: 8, AGREE: 5 },
      },
      {
        author: "first_vial",
        body: `The concentration math tripped me up hard at first. I kept thinking in mL. once someone told me "just think in units on your syringe" it clicked immediately.`,
        daysAgo: 124,
        reactions: { LIKE: 3 },
      },
      {
        author: "showmethestudy",
        body: `Worth noting that "SubQ vs IM" for BPC-157 is more nuanced than you're making it sound — the original rat studies used both IP and IM, and there's a reasonable argument that site-specific injection (near the injury) matters more than route. I'm not saying run IM, but "stop stabbing your glutes" is a little glib.`,
        daysAgo: 120,
        reactions: { AGREE: 4 },
      },
      {
        author: "cardinal_rule",
        body: `@showmethestudy fair. Site-specific vs systemic is a whole separate rabbit hole. For absolute beginners: subQ in the belly works, start there. People can get fancier once they know what they're doing.`,
        daysAgo: 120,
        reactions: { AGREE: 6 },
      },
      {
        author: "curious_catL",
        body: `This should be required reading lol. Just joined, appreciate this being at the top.`,
        daysAgo: 110,
        reactions: { LIKE: 2 },
      },
      {
        author: "tendon_theory",
        body: `Adding for the injury folks who find this thread — if your goal is a specific tendon/ligament, site-specific SubQ injection near the area (not IN the tendon, obviously) is the move. BPC in the belly works but local probably works better for local issues. Anecdotal, but consistent across a lot of people.`,
        daysAgo: 95,
        reactions: { USEFUL: 9, AGREE: 5 },
      },
      {
        author: "reads_more_posts",
        body: `Lurked for 2 months, finally posting. This thread made me feel like I could actually ask stuff without getting roasted. Thank you.`,
        daysAgo: 62,
        reactions: { LIKE: 6, THANKS: 3 },
      },
      {
        author: "bpc_baby",
        body: `Saved. my username should tell you what I ran into lol`,
        daysAgo: 40,
        reactions: { FUNNY: 7 },
      },
      {
        author: "late_bloomer_m",
        body: `Just found this. Five months in this forum and this post is still the most useful single thing I've read. Bumping for the new folks.`,
        daysAgo: 8,
        reactions: { LIKE: 4, THANKS: 2 },
      },
      {
        author: "cardinal_rule",
        body: `Thanks all. Will update this in a few weeks with a section on GLP-1s since half the new posts are tirz/reta questions now.`,
        daysAgo: 6,
        reactions: { LIKE: 5, USEFUL: 3 },
      },
    ],
  },

  // ============================================================
  // POPULAR THREADS — 15-25 replies each, 5 more (total 6 incl. pinned)
  // ============================================================
  {
    title: "First cycle ever — BPC-157 for a rotator cuff issue. sanity check my plan?",
    body: `Hi all, 34M, been lifting 10+ years, tweaked my right shoulder back in January doing incline press. MRI showed a small partial supraspinatus tear, PT has helped but it's been plateau'd for 6 weeks. Doc doesn't want to do PRP yet.

Ordered BPC-157 5mg vial + bac water. Plan:
- Reconstitute with 2mL bac water = 2.5mg/mL
- 250mcg 2x/day SubQ, in the belly (about an inch from the navel)
- 30 days on, evaluate

A few q's:
1. Should I be injecting closer to the shoulder instead? heard conflicting things
2. Do I need to pair with TB500 or is BPC enough to start?
3. How long before I should expect to feel anything?

Don't want to rush into this. Thanks in advance.`,
    author: "rotator_rebuild",
    daysAgo: 92,
    views: 2140,
    reactions: { LIKE: 8, USEFUL: 4 },
    replies: [
      {
        author: "tendon_theory",
        body: `Your plan is fine but I'd go site-specific. Inject SubQ into the fatty tissue near the front of the shoulder (delt area, superficial — you're not aiming for the tendon). BPC seems to work better closer to the injury for soft tissue stuff. Dose is fine. 500mcg/day total is a solid starting point.`,
        daysAgo: 92,
        reactions: { USEFUL: 12, AGREE: 7 },
      },
      {
        author: "hexaclinic",
        body: `Second tendon_theory. I'd also extend to 6 weeks rather than 30 days for a partial tear — tendon remodeling is slow. 30 days is enough to see trajectory but not enough to judge outcome.`,
        daysAgo: 92,
        reactions: { USEFUL: 9, AGREE: 4 },
      },
      {
        author: "rotator_rebuild",
        body: `@tendon_theory so I'd pinch the skin over the front delt and inject into the pinch? just want to make sure I'm not going to hit something`,
        daysAgo: 91,
      },
      {
        author: "tendon_theory",
        body: `Yep, pinch + insulin needle at 45 degrees. You're going into subcutaneous fat, not muscle. Don't overthink it.`,
        daysAgo: 91,
        reactions: { USEFUL: 6, THANKS: 3 },
      },
      {
        author: "shoulder_spring",
        body: `Ran this exact protocol last year for an AC joint issue (not the same as yours but similar area). Felt nothing for 3 weeks, week 4-5 had noticeable reduction in the grinding sensation on overhead pressing. Kept going to week 8. Was one of the things that actually worked for me. YMMV.`,
        daysAgo: 91,
        reactions: { USEFUL: 11, LIKE: 4 },
      },
      {
        author: "tb500_train",
        body: `TB500 adds something for muscle/tendon belly issues, less clear for partial tears. I'd start with BPC alone so you know what it's doing. Add TB later if you're stalling.`,
        daysAgo: 90,
        reactions: { AGREE: 8, USEFUL: 3 },
      },
      {
        author: "showmethestudy",
        body: `Just flagging: the BPC-157 evidence for human rotator cuff outcomes is ~zero. The tendon/ligament rat studies are promising but extrapolating to a human partial supra tear is a leap. Go in eyes open. If it works, great. If it doesn't, PT + time + eventually PRP is still your path.`,
        daysAgo: 90,
        reactions: { AGREE: 9, USEFUL: 5 },
      },
      {
        author: "rotator_rebuild",
        body: `@showmethestudy fair point, appreciated. I'm going in knowing it's n=1. PT isn't going away.`,
        daysAgo: 90,
        reactions: { AGREE: 4 },
      },
      {
        author: "dr_doubt",
        body: `Your reconstitution math is right. 2mL bac into 5mg = 2.5mg/mL = 2500mcg/mL. On a U-100 insulin syringe, 10 units = 250mcg. Write it down on the vial with a sharpie so you don't second-guess yourself at 6am.`,
        daysAgo: 89,
        reactions: { USEFUL: 14, LIKE: 3 },
      },
      {
        author: "acl_again",
        body: `Following. I have a similar question lined up for an AC joint thing. Not hijacking, just lurking here.`,
        daysAgo: 88,
      },
      {
        author: "meniscus_mgmt",
        body: `One more vote for site-specific. I did belly injections for my knee for 3 weeks and saw nothing, switched to around-the-knee injections and the response was noticeably different within ~10 days.`,
        daysAgo: 86,
        reactions: { USEFUL: 7, AGREE: 4 },
      },
      {
        author: "rotator_rebuild",
        body: `UPDATE week 2: did site-specific near front delt as suggested. no side effects, no obvious change yet. PT session yesterday was about the same as baseline. will keep going.`,
        daysAgo: 78,
        reactions: { LIKE: 6, THANKS: 2 },
      },
      {
        author: "rotator_rebuild",
        body: `UPDATE week 4: overhead press pain noticeably reduced. still there but like 4/10 instead of 7/10. not claiming BPC is the cause, PT is also going well, but it's been stalled for 6 weeks before this so the timing is interesting. extending to 8 weeks.`,
        daysAgo: 64,
        reactions: { LIKE: 12, USEFUL: 6, THANKS: 3 },
      },
      {
        author: "shoulder_spring",
        body: `@rotator_rebuild that tracks with my experience. week 4-6 is usually when things shift.`,
        daysAgo: 64,
        reactions: { AGREE: 3 },
      },
      {
        author: "protocolpilot",
        body: `Nice update. For the permanent record: this is what a good beginner thread looks like — ask a question, get advice, try it, report back. Bookmarking.`,
        daysAgo: 63,
        reactions: { LIKE: 9, AGREE: 5 },
      },
      {
        author: "rotator_rebuild",
        body: `FINAL UPDATE week 8: done. Pain is about 2/10 now and only at end range. PT moved me into a more aggressive phase. not cured but dramatically better than 8 weeks ago. taking a month off peptides and seeing how it holds.`,
        daysAgo: 36,
        reactions: { LIKE: 18, USEFUL: 7, THANKS: 6 },
      },
      {
        author: "joint_hunter",
        body: `Reading this thread top to bottom was worth more than three hours of youtube. thanks for documenting it.`,
        daysAgo: 22,
        reactions: { THANKS: 4, LIKE: 2 },
      },
    ],
  },

  {
    title: "Is 2.5mg/week tirzepatide too low to start? I've seen people running 5mg first dose",
    body: `33F, BMI 31, never done any peptide or GLP-1 before. Doc won't prescribe (I'm not "quite" diabetic, A1c 5.8) so going the research route.

Reading around it seems like pharma starts people at 2.5mg for 4 weeks, then titrates. But in forums I see people saying "just start at 5, 2.5 does nothing." What's the actual play for a first-timer?

My goal is 30-40lb off over 6+ months. Not trying to rush.`,
    author: "slow_lose",
    daysAgo: 74,
    views: 3280,
    reactions: { LIKE: 6, USEFUL: 3 },
    replies: [
      {
        author: "tirzepatide_tim",
        body: `Start at 2.5. The people saying "just start at 5" are the same people ending up on the couch for 4 days with GI nausea hell. The titration schedule exists for a reason — tirz has a 5-day half life so even 2.5 accumulates over the first 2 weeks. You will notice appetite reduction at 2.5.`,
        daysAgo: 74,
        reactions: { AGREE: 14, USEFUL: 9, LIKE: 3 },
      },
      {
        author: "glp1_doctor_pt",
        body: `+1 to above. I work with patients on tirz/sema daily. The people who jump to 5mg first dose account for a disproportionate share of "I had to stop, couldn't tolerate it." Slow is fast here.`,
        daysAgo: 74,
        reactions: { AGREE: 11, USEFUL: 8 },
      },
      {
        author: "sema_saturday",
        body: `Ran 2.5 for 6 weeks before moving to 5. No drama, appetite dropped week 2. Your A1c is gonna love you.`,
        daysAgo: 73,
        reactions: { LIKE: 5, USEFUL: 2 },
      },
      {
        author: "microdose_glp1",
        body: `You can even go slower than 2.5 if you're sensitive — I did 1mg for the first two weeks, then 2.5. some people microdose tirz long term at 1.25-1.75. Works.`,
        daysAgo: 73,
        reactions: { USEFUL: 7, LIKE: 2 },
      },
      {
        author: "slow_lose",
        body: `@microdose_glp1 wait so you can split a 2.5 dose? how do you know you're getting the right amount`,
        daysAgo: 73,
      },
      {
        author: "microdose_glp1",
        body: `@slow_lose yes, that's literally what the syringe math is for. If you reconstitute a 10mg vial with 2mL bac water, that's 5mg/mL. 5 units on a U-100 syringe = 0.05mL = 0.25mg. Units on the syringe = mg with predictable math once you set your concentration.`,
        daysAgo: 73,
        reactions: { USEFUL: 13, THANKS: 4 },
      },
      {
        author: "plateau_breaker",
        body: `Also — don't skip the "boring" stuff. hydration, protein at 0.8-1g per lb bodyweight, electrolytes (especially sodium) first 2 weeks. The nausea people blame on tirz is often just dehydration + low sodium.`,
        daysAgo: 72,
        reactions: { USEFUL: 15, AGREE: 9, LIKE: 3 },
      },
      {
        author: "fat_loss_log",
        body: `^^^ this. I had zero nausea on tirz and I credit electrolytes + eating slowly.`,
        daysAgo: 72,
        reactions: { AGREE: 6 },
      },
      {
        author: "fridge_protein",
        body: `The name checks out for me — tirz made me stop eating without realizing it. Set alarms to eat protein. Muscle loss on these drugs is real if you're not paying attention.`,
        daysAgo: 71,
        reactions: { AGREE: 8, USEFUL: 4 },
      },
      {
        author: "slow_lose",
        body: `thanks everyone. starting 2.5 this weekend. will probably repost in a few weeks.`,
        daysAgo: 70,
        reactions: { LIKE: 4, THANKS: 2 },
      },
      {
        author: "nullhypothesis",
        body: `Just noting for the record that "2.5mg does nothing" is a thing people say who don't keep a food log. The pharmacokinetics do not lie — you have drug in your system at 2.5. If "nothing happens" it's because you weren't tracking.`,
        daysAgo: 69,
        reactions: { AGREE: 7, LIKE: 3 },
      },
      {
        author: "retatrutide_r",
        body: `If you're considering other options long-term, reta has a cleaner side-effect profile for a lot of people at comparable fat loss. But tirz is totally fine to start, well-characterized, and the research supply is better.`,
        daysAgo: 66,
        reactions: { USEFUL: 5 },
      },
      {
        author: "cagrisema",
        body: `^ second on reta for the future. tirz is the right first-timer choice though, learn the routine first.`,
        daysAgo: 66,
        reactions: { AGREE: 3 },
      },
      {
        author: "slow_lose",
        body: `Update week 3 on 2.5: down 6lb, appetite definitely reduced, mild nausea day after dose which goes away by day 2. electrolytes helped a lot. Going to do one more week at 2.5 and then titrate to 5.`,
        daysAgo: 52,
        reactions: { LIKE: 14, THANKS: 4 },
      },
      {
        author: "tirzepatide_tim",
        body: `@slow_lose great start. Tip: when you bump to 5, don't be surprised if the appetite effect feels "same" for a week — that's normal because the accumulation is what matters not the step. Let 5 run 4 weeks before deciding whether you need 7.5.`,
        daysAgo: 52,
        reactions: { USEFUL: 11, THANKS: 3 },
      },
      {
        author: "slow_lose",
        body: `Update week 8: on 5mg for 3 weeks now, total loss 14lb. No issues. Eating more protein than I ever have. Thanks to everyone in this thread.`,
        daysAgo: 30,
        reactions: { LIKE: 22, THANKS: 9, USEFUL: 4 },
      },
      {
        author: "plateau_breaker",
        body: `Love to see it. Get a DEXA around month 3-4, you want to confirm you're losing fat not muscle.`,
        daysAgo: 30,
        reactions: { USEFUL: 8, AGREE: 4 },
      },
      {
        author: "dexa_devotee",
        body: `^ hi yes DEXA gang checking in. Book it.`,
        daysAgo: 29,
        reactions: { FUNNY: 9, LIKE: 3 },
      },
      {
        author: "goal_driven",
        body: `Reading this thread a month after posting my own tirz question — this is the template. Thank you OP for updating.`,
        daysAgo: 14,
        reactions: { LIKE: 5, THANKS: 2 },
      },
    ],
  },

  {
    title: "Reconstitution freakout — did I ruin my vial?",
    body: `Ok so picture this. 5mg BPC-157 vial. I added bac water but I shook it. Like, shook shook it. Saw later that you're supposed to swirl. The solution looks clear, no foam, no weird particles. But I'm reading horror stories about people destroying their peptide.

Did I wreck it? Can I still use it? Or do I need to chuck it and order another?

(yes I know I should have read first. tired mom of 2, just wanted to get it done. please be kind.)`,
    author: "petal_push",
    daysAgo: 58,
    views: 1850,
    reactions: { LIKE: 7 },
    replies: [
      {
        author: "lucidverse",
        body: `You're fine. BPC-157 is actually one of the sturdier peptides. The "don't shake" rule is mostly about fragile stuff (GHK-Cu, thymosin beta 4 can be a little more sensitive, GH releasers can get foamy and you lose dose in the foam). A shake-vs-swirl mistake isn't going to meaningfully degrade BPC. Use the vial.`,
        daysAgo: 58,
        reactions: { USEFUL: 18, THANKS: 9, LIKE: 4 },
      },
      {
        author: "petal_push",
        body: `oh thank god. thank you.`,
        daysAgo: 58,
        reactions: { LIKE: 3, FUNNY: 2 },
      },
      {
        author: "mothra",
        body: `Context: peptides are chains of amino acids. "Shaking" can theoretically denature some proteins through mechanical stress at the air-water interface, but the internet has massively overblown this for small research peptides. The foam concern is real (you lose material). Shake-induced destruction of a small peptide? way overstated.`,
        daysAgo: 58,
        reactions: { USEFUL: 13, AGREE: 6 },
      },
      {
        author: "bac_water_noob",
        body: `Was literally about to post the same question. bookmarking.`,
        daysAgo: 57,
        reactions: { LIKE: 2 },
      },
      {
        author: "citation_required",
        body: `Just to be accurate: the aggregation/denaturation risk from shaking IS documented in peptide formulation literature, but the effect size for small peptides like BPC-157 (15 amino acids, small molecular weight, fairly robust structure) is minimal. For larger proteins like antibodies it's a bigger deal. TLDR lucidverse is right, people carry over a concern from biologics that doesn't apply as strongly here.`,
        daysAgo: 57,
        reactions: { USEFUL: 11, AGREE: 4, LIKE: 2 },
      },
      {
        author: "hexaclinic",
        body: `If you're worried, look at the solution. Clear? Fine. Cloudy, fibers, particulates? Not fine. Yours sounds fine.`,
        daysAgo: 57,
        reactions: { USEFUL: 7 },
      },
      {
        author: "petal_push",
        body: `It's clear. Pulling my first dose in a sec. Thanks for not roasting me.`,
        daysAgo: 57,
        reactions: { LIKE: 5, THANKS: 3 },
      },
      {
        author: "syringe_shy",
        body: `@petal_push we were all there once. the first dose is the scariest.`,
        daysAgo: 57,
        reactions: { LIKE: 4 },
      },
      {
        author: "first_vial",
        body: `Add me to the "shook the vial on my first reconstitution" club. I'm on vial 8 now, no regrets, no wasted product.`,
        daysAgo: 56,
        reactions: { FUNNY: 8, LIKE: 3 },
      },
      {
        author: "reggae_fiend",
        body: `Swirl is best practice. Shake isn't the sin it's made out to be. Welcome to peptides. Enjoy the mom-of-2 micro doses, the pocket of time you get when the appetite suppressant kicks in is God's gift.`,
        daysAgo: 56,
        reactions: { FUNNY: 11, LIKE: 5 },
      },
      {
        author: "petal_push",
        body: `@reggae_fiend I'm not on a GLP-1 lol, this is BPC for postpartum joint stuff. But noted for when my younger is in school lmao`,
        daysAgo: 56,
        reactions: { FUNNY: 6, LIKE: 2 },
      },
      {
        author: "protocolwonk",
        body: `For your postpartum joint stuff — look at GHK-Cu + BPC together, it's a popular combo. GHK is the "shake more carefully" one.`,
        daysAgo: 55,
        reactions: { USEFUL: 5 },
      },
      {
        author: "petal_push",
        body: `@protocolwonk on my list. BPC first, one thing at a time.`,
        daysAgo: 55,
        reactions: { AGREE: 4 },
      },
      {
        author: "lucidverse",
        body: `^^ good discipline. 80% of forum questions are from people running 4 things at once and blaming the wrong one.`,
        daysAgo: 55,
        reactions: { AGREE: 9, LIKE: 3 },
      },
      {
        author: "petal_push",
        body: `Update 10 days in: no issues at all. knee pain improving. Thanks all.`,
        daysAgo: 45,
        reactions: { LIKE: 8, THANKS: 3 },
      },
      {
        author: "questions_mode",
        body: `Posting in this thread because I can't bring myself to start a new one — I also shook mine. Going to use it.`,
        daysAgo: 20,
        reactions: { LIKE: 4, FUNNY: 3 },
      },
    ],
  },

  {
    title: "How many of you actually notice Selank same-day vs it taking a few days?",
    body: `Running Selank for the first time. 250mcg intranasal, one dose in the morning. Day 1-3 I felt nothing. Day 4-5 I started to feel what I'd call "noise reduction" in my head. Is this normal? I keep seeing "hit me immediately" stories and was starting to think I got a bad batch.`,
    author: "selank_silence",
    daysAgo: 48,
    views: 1620,
    reactions: { LIKE: 5 },
    replies: [
      {
        author: "semax_mornings",
        body: `Super normal. The "first dose hit me like a truck" people are either (a) sensitive responders, (b) expecting something, or (c) dosing way higher than 250mcg. 250 is on the lower end. Some people bump to 500-900mcg for a clearer effect. Day 4-5 onset at 250 is typical.`,
        daysAgo: 48,
        reactions: { USEFUL: 13, AGREE: 6 },
      },
      {
        author: "noots_noop",
        body: `Selank is subtle for me too. Not a "feel" drug. It's more "oh, I notice I didn't spiral after that meeting" in retrospect.`,
        daysAgo: 48,
        reactions: { AGREE: 9, LIKE: 4 },
      },
      {
        author: "cerebrolysin_cb",
        body: `Took me two weeks to notice on selank. semax was faster. Both subtle. anyone who tells you they got euphoric on intranasal selank is lying.`,
        daysAgo: 47,
        reactions: { AGREE: 8, FUNNY: 5 },
      },
      {
        author: "selank_silence",
        body: `Ok good, I was gaslighting myself. Any reason to bump to 500?`,
        daysAgo: 47,
      },
      {
        author: "semax_mornings",
        body: `If after 2 full weeks at 250 you still feel basically nothing, try 500 for a week. But don't rush — subtle is kind of the point. The people pushing 900mcg+ are usually chasing a "feel" that isn't really what this compound does.`,
        daysAgo: 47,
        reactions: { USEFUL: 10, AGREE: 4 },
      },
      {
        author: "theoretic",
        body: `The proposed mechanism is modulation of GABAergic tone and upregulation of BDNF. Neither of those gives you a punch-in-the-face acute effect. It's cumulative and contextual — you notice it in high-anxiety situations, not sitting on the couch.`,
        daysAgo: 46,
        reactions: { USEFUL: 14, AGREE: 5 },
      },
      {
        author: "placebo_possible",
        body: `Worth mentioning — selank's human evidence is almost entirely from Russian clinical literature, and replication outside that context is thin. Subjective "noise reduction" at day 4 could very easily be placebo. Not saying don't run it, just calibrate expectations.`,
        daysAgo: 46,
        reactions: { AGREE: 6, LIKE: 3 },
      },
      {
        author: "selank_silence",
        body: `@placebo_possible fair. Honestly even if it's placebo and I'm less anxious, I'll take it lol`,
        daysAgo: 46,
        reactions: { FUNNY: 11, AGREE: 4 },
      },
      {
        author: "pde_brainer",
        body: `Intranasal bioavailability for these heptapeptides is variable. Spray quality matters, technique matters (exhale first, spray at end of inhale, don't sniff hard). If your "immediate effect" friends are getting better intranasal delivery, that could be part of it.`,
        daysAgo: 45,
        reactions: { USEFUL: 9 },
      },
      {
        author: "selank_silence",
        body: `@pde_brainer didn't even think about technique. what's your routine`,
        daysAgo: 45,
      },
      {
        author: "pde_brainer",
        body: `Blow nose first. Tilt head slightly forward (NOT back — that drains it down your throat). Spray once per nostril at the beginning of a slow inhale. Hold head still for 30 seconds. Don't sniff sharply.`,
        daysAgo: 45,
        reactions: { USEFUL: 16, THANKS: 7, LIKE: 3 },
      },
      {
        author: "selank_silence",
        body: `Tried the technique + day 8 of dosing. Definitely better. Gonna say Selank works for me, ~15% less anxiety baseline. Not life-changing but real.`,
        daysAgo: 41,
        reactions: { LIKE: 10, USEFUL: 3, THANKS: 2 },
      },
      {
        author: "quietstorm",
        body: `"15% less anxiety baseline" is exactly the honest calibration people should use when reporting on nootropics. Not "cured my ADHD" energy. Thank you.`,
        daysAgo: 41,
        reactions: { AGREE: 12, LIKE: 5 },
      },
      {
        author: "reading_mode",
        body: `Bookmarking the technique tip. changes everything.`,
        daysAgo: 30,
        reactions: { LIKE: 4 },
      },
      {
        author: "cautious_ox",
        body: `Jumping on here — week 3 on selank 250mcg. Same experience. subtle but real. I notice it most on calls I used to dread.`,
        daysAgo: 12,
        reactions: { LIKE: 5, AGREE: 2 },
      },
    ],
  },

  {
    title: "Why is my BPC vial yellow? I thought it was supposed to be clear",
    body: `Got a fresh shipment. One vial is clear, one has a faint yellow/amber tint. Both from the same supplier, ordered together. Should I be worried?`,
    author: "vintage_lame",
    daysAgo: 38,
    views: 1390,
    reactions: { LIKE: 3 },
    replies: [
      {
        author: "hexaclinic",
        body: `Is it reconstituted yet? Dry powder BPC is white/off-white. Clear when reconstituted. A faintly yellow tint in lyophilized powder CAN be normal (mannitol or other excipients) but a yellow SOLUTION post-reconstitution is iffy.`,
        daysAgo: 38,
        reactions: { USEFUL: 14, LIKE: 4 },
      },
      {
        author: "vintage_lame",
        body: `@hexaclinic the powder itself. pre-reconstitution. Other vials same supplier are pure white.`,
        daysAgo: 38,
      },
      {
        author: "hexaclinic",
        body: `Could be a stability issue, could be a different batch. If I had it I'd reconstitute it, see if the solution is clear. If clear, it's probably fine. If yellow post-reconstitution, don't use it.`,
        daysAgo: 38,
        reactions: { USEFUL: 10 },
      },
      {
        author: "dr_doubt",
        body: `Yellow dry powder = could be many things, most benign (excipient differences, minor oxidation that doesn't affect potency). Yellow or cloudy solution after bac water = I'd toss.`,
        daysAgo: 38,
        reactions: { AGREE: 8, USEFUL: 5 },
      },
      {
        author: "protocolpilot",
        body: `Ask the supplier for a COA for that batch. Good suppliers will send it. Also, take a photo of both vials side by side and email it to them. Most will replace if legit concern.`,
        daysAgo: 37,
        reactions: { USEFUL: 9, AGREE: 3 },
      },
      {
        author: "vintage_lame",
        body: `@protocolpilot emailed them. will report back.`,
        daysAgo: 37,
      },
      {
        author: "lost_my_reps",
        body: `I had the exact same thing 2 months ago. Supplier sent a COA, the tinted vial was from a different lot. Tested fine. I used it with no issues.`,
        daysAgo: 37,
        reactions: { USEFUL: 6, LIKE: 2 },
      },
      {
        author: "showmethestudy",
        body: `"Tested fine" according to what? Eyeballing the solution and not feeling sick isn't a potency test.`,
        daysAgo: 36,
        reactions: { AGREE: 5 },
      },
      {
        author: "lost_my_reps",
        body: `@showmethestudy the supplier's COA showed 98% purity for both lots. sorry should have been clearer.`,
        daysAgo: 36,
        reactions: { USEFUL: 4 },
      },
      {
        author: "vintage_lame",
        body: `UPDATE: supplier responded, sent COA, different lot, tested 97.8%. Clear solution when reconstituted. Using it.`,
        daysAgo: 34,
        reactions: { LIKE: 8, USEFUL: 4, THANKS: 2 },
      },
      {
        author: "bpc_baby",
        body: `thank god I found this thread. mine is also kind of off-white and I've been stressing. will email the supplier.`,
        daysAgo: 28,
        reactions: { LIKE: 3 },
      },
      {
        author: "nullhypothesis",
        body: `Flagging for anyone reading later: supplier-provided COAs have obvious conflict of interest problems. They're better than nothing but not a substitute for independent testing.`,
        daysAgo: 26,
        reactions: { AGREE: 7, USEFUL: 4 },
      },
      {
        author: "protocolwonk",
        body: `@nullhypothesis agreed, though independent HPLC testing is cost-prohibitive for most hobbyists. Best practical bet is: reputable supplier + their COAs + community reputation + eyeballs on the product.`,
        daysAgo: 26,
        reactions: { AGREE: 8, USEFUL: 3 },
      },
      {
        author: "vintage_lame",
        body: `2 weeks in, vial behaving normally, healing as expected. closing the loop for anyone who finds this thread via search.`,
        daysAgo: 18,
        reactions: { LIKE: 6, THANKS: 3 },
      },
      {
        author: "reads_more_posts",
        body: `This is the type of thread I search this forum for. clear problem, actual troubleshooting, closure. thanks.`,
        daysAgo: 10,
        reactions: { THANKS: 3, LIKE: 2 },
      },
    ],
  },

  {
    title: "Do I actually need to inject in the morning vs before bed? Thymosin Alpha-1 timing",
    body: `Running Thymosin Alpha-1 (not TB500, different compound — immune one) for chronic low-grade stuff my doc can't figure out. Supplier said "morning" but didn't explain why. If I'm more likely to remember at night, does it actually matter?`,
    author: "curious_catL",
    daysAgo: 29,
    views: 1120,
    reactions: { LIKE: 4 },
    replies: [
      {
        author: "mothra",
        body: `TA-1 works primarily on T-cell maturation / immune signaling. It doesn't have a sharp circadian sensitivity like GH releasers do. Timing matters for things that align with natural pulses (ipamorelin/CJC at night to amplify the GH pulse) — TA-1 not really. Morning is tradition, not requirement. Consistency beats timing.`,
        daysAgo: 29,
        reactions: { USEFUL: 16, LIKE: 5, THANKS: 2 },
      },
      {
        author: "curious_catL",
        body: `^^ this is the kind of answer I came here for, thank you.`,
        daysAgo: 29,
        reactions: { THANKS: 3, LIKE: 2 },
      },
      {
        author: "hexaclinic",
        body: `Second mothra. For TA-1 specifically, the dosing frequency matters more (usually 2x/week SubQ at 1.6mg) than time of day.`,
        daysAgo: 29,
        reactions: { AGREE: 7, USEFUL: 4 },
      },
      {
        author: "curious_catL",
        body: `I'm doing 1.6mg 2x/week. tue/fri. that sounds right?`,
        daysAgo: 28,
      },
      {
        author: "hexaclinic",
        body: `Tue/Fri is fine, anything with ~3 day spacing works. The important thing is consistency for several weeks — TA-1 is not a "feel it in a day" compound.`,
        daysAgo: 28,
        reactions: { USEFUL: 8 },
      },
      {
        author: "theoretic",
        body: `Re: timing in general — most of the "must inject in the morning" rules online come from two places: (1) GH pulse amplification for ghrelin mimetics, (2) avoiding sleep disruption with stimulating compounds. Most peptides don't fall in either bucket. Don't over-index on timing.`,
        daysAgo: 28,
        reactions: { USEFUL: 14, AGREE: 7 },
      },
      {
        author: "protocolpilot",
        body: `Save this thread. Half of beginner protocol confusion is "when do I inject" and the answer is almost always "doesn't matter, stay consistent."`,
        daysAgo: 27,
        reactions: { AGREE: 11, LIKE: 4 },
      },
      {
        author: "stackbuilder",
        body: `The exceptions worth knowing:
- GH secretagogues (CJC, ipa, tesamorelin): night, ideally pre-sleep
- DSIP: pre-sleep (name literally "delta sleep inducing peptide")
- Semax: morning (mildly stimulating)
- Selank: anytime but many prefer morning
- BPC, TB500, TA-1, GHK-Cu, most others: whenever you remember
- GLP-1s (tirz, sema, reta): weekly, pick a day, morning vs night doesn't matter much but avoid right before a heavy meal`,
        daysAgo: 27,
        reactions: { USEFUL: 19, THANKS: 8, LIKE: 4 },
      },
      {
        author: "curious_catL",
        body: `@stackbuilder can we pin this as a subthread comment somehow lol, this is what I needed`,
        daysAgo: 27,
        reactions: { AGREE: 5, LIKE: 2 },
      },
      {
        author: "cyclecraft",
        body: `Stackbuilder's list is accurate. One nit: I prefer GHK-Cu morning-ish because of color staining — if you inject at night, the slight copper-blue bruise at the site is more noticeable the next day. Cosmetic only.`,
        daysAgo: 26,
        reactions: { USEFUL: 6, FUNNY: 3 },
      },
      {
        author: "frontloader",
        body: `One more: if you're running tesamorelin, be aware injection site reactions are more common than with most SubQ peptides. Rotate sites.`,
        daysAgo: 26,
        reactions: { USEFUL: 7 },
      },
      {
        author: "curious_catL",
        body: `Updating for anyone reading: switched to evening dosing for TA-1, much easier to remember, no difference in outcome. Thanks all.`,
        daysAgo: 18,
        reactions: { LIKE: 6, THANKS: 3 },
      },
      {
        author: "notes_taker",
        body: `saving the stackbuilder comment. this is the kind of no-nonsense reference I needed.`,
        daysAgo: 9,
        reactions: { LIKE: 3 },
      },
    ],
  },

  // ============================================================
  // ACTIVE THREADS — 6-12 replies each, 10 threads
  // ============================================================

  {
    title: "Can I reuse an insulin syringe for a second dose later in the day?",
    body: `Same peptide, same vial, same day. Seems wasteful to pitch a syringe after 10 units. Is this actually a problem?`,
    author: "bac_water_noob",
    daysAgo: 116,
    views: 890,
    replies: [
      {
        author: "dr_doubt",
        body: `Don't. It's false economy. Insulin needles are like 15 cents each in bulk. You want a sterile needle and a sharp tip. A reused needle is duller (more painful) and contamination risk is nonzero, especially if you're pulling from a multi-dose vial repeatedly.`,
        daysAgo: 116,
        reactions: { AGREE: 14, USEFUL: 7 },
      },
      {
        author: "nopain_noreign",
        body: `Used needles on second stick hurt like hell. That alone is reason enough.`,
        daysAgo: 116,
        reactions: { AGREE: 9, FUNNY: 4 },
      },
      {
        author: "bac_water_noob",
        body: `Ok fair, pitching them.`,
        daysAgo: 115,
        reactions: { LIKE: 2 },
      },
      {
        author: "syringe_shy",
        body: `Also a sterile needle each time means if you get a bad injection site, you know it wasn't the needle.`,
        daysAgo: 115,
        reactions: { USEFUL: 5, AGREE: 2 },
      },
      {
        author: "hexaclinic",
        body: `Box of 100 BD insulin syringes is like $15. There's no good reason to reuse.`,
        daysAgo: 114,
        reactions: { AGREE: 7 },
      },
      {
        author: "reggae_fiend",
        body: `saving on syringes but spending $80 on peptides is backwards economy.`,
        daysAgo: 114,
        reactions: { FUNNY: 11, AGREE: 4 },
      },
    ],
  },

  {
    title: "Lump under the skin at injection site, not red, not hot — normal?",
    body: `Week 2 of BPC, injecting belly. Yesterday's injection left a small firm lump about the size of a pea under the skin. Not red, not warm, not particularly painful unless I press on it. Is this an abscess forming or just a normal reaction?`,
    author: "first_vial",
    daysAgo: 108,
    views: 1340,
    reactions: { LIKE: 2 },
    replies: [
      {
        author: "lucidverse",
        body: `Sounds like a subcutaneous infiltrate. Not an abscess. Abscesses are red, warm, very painful, and trending worse. Non-red, non-warm lumps after SubQ are usually just undissolved solution or minor tissue reaction. Should resolve in 3-7 days. Rotate sites.`,
        daysAgo: 108,
        reactions: { USEFUL: 14, AGREE: 6, THANKS: 3 },
      },
      {
        author: "first_vial",
        body: `Oh ok phew. I was googling abscess photos and freaking out.`,
        daysAgo: 108,
        reactions: { FUNNY: 6, LIKE: 2 },
      },
      {
        author: "protocolpilot",
        body: `Warning signs: red streaking from the site, fever, pain getting worse over 48hrs, the lump getting noticeably bigger day over day. Any of those = urgent care.`,
        daysAgo: 108,
        reactions: { USEFUL: 11, AGREE: 4 },
      },
      {
        author: "dr_doubt",
        body: `Are you rotating sites? Same-inch-of-belly repeatedly = lumpy belly. Move around. Think of it like a clock face around your navel.`,
        daysAgo: 107,
        reactions: { USEFUL: 8, AGREE: 3 },
      },
      {
        author: "first_vial",
        body: `@dr_doubt I've been hitting basically the same spot. My bad.`,
        daysAgo: 107,
      },
      {
        author: "hexaclinic",
        body: `Also: let the bac water warm up a little before injection, and push slowly. Fast cold injections are lumpier.`,
        daysAgo: 106,
        reactions: { USEFUL: 7 },
      },
      {
        author: "first_vial",
        body: `Update 4 days: lump is gone. rotating sites now. thanks all.`,
        daysAgo: 103,
        reactions: { LIKE: 5, THANKS: 2 },
      },
    ],
  },

  {
    title: "What's the difference between TB500 and thymosin beta-4?",
    body: `I keep reading them used interchangeably but also separately. Which is it? Is it just branding?`,
    author: "reading_mode",
    daysAgo: 101,
    views: 1480,
    replies: [
      {
        author: "theoretic",
        body: `Thymosin beta-4 (Tβ4) is a 43-amino-acid protein naturally produced in the body. "TB500" is a marketing/research name for a synthetic fragment, often cited as the "active region" of Tβ4. In practice, most "TB500" products are either the full Tβ4 sequence or a fragment, and suppliers label inconsistently. Functionally in the research-peptide world, people use them interchangeably. Mechanistically, they're related but not technically identical.`,
        daysAgo: 101,
        reactions: { USEFUL: 17, LIKE: 5, THANKS: 3 },
      },
      {
        author: "reading_mode",
        body: `@theoretic so if I buy "TB500" am I getting the full protein or the fragment?`,
        daysAgo: 101,
      },
      {
        author: "theoretic",
        body: `Depends on the supplier. Most research-grade "TB500" is the full Tβ4. Some are a fragment (LKKTETQ + stabilizers). Read the COA if you care — mass / molecular weight tells you which.`,
        daysAgo: 101,
        reactions: { USEFUL: 10, THANKS: 2 },
      },
      {
        author: "mothra",
        body: `Practically speaking the outcomes are similar. Most anecdotal reports and the small amount of human data don't distinguish between them because the labeling is chaos.`,
        daysAgo: 100,
        reactions: { AGREE: 6, USEFUL: 4 },
      },
      {
        author: "citation_required",
        body: `This is a good thread to bookmark because "what's TB500" is asked weekly and the answer is "the labels are a mess and you should read your COA."`,
        daysAgo: 100,
        reactions: { AGREE: 8, LIKE: 3 },
      },
      {
        author: "reading_mode",
        body: `Thanks everyone. COA'd my vial, it's full Tβ4.`,
        daysAgo: 98,
        reactions: { LIKE: 4, THANKS: 2 },
      },
      {
        author: "tb500_train",
        body: `Username checks out, confirming that in 4 years of running "TB500" I've used both fragment and full Tβ4 products with indistinguishable subjective outcomes. n=1.`,
        daysAgo: 95,
        reactions: { FUNNY: 5, USEFUL: 3 },
      },
      {
        author: "showmethestudy",
        body: `FYI: the "active fragment" story is widely repeated but the underlying claim that the fragment alone is sufficient isn't super well-supported outside marketing material. Full Tβ4 is what almost all the published work uses.`,
        daysAgo: 94,
        reactions: { AGREE: 5, USEFUL: 4 },
      },
    ],
  },

  {
    title: "First tirz shot tomorrow. What should I have in the house?",
    body: `Starting 2.5mg tomorrow morning. Have the pen, sharps container, ordered alcohol swabs. Anything else I'm going to wish I had?`,
    author: "fresh_cycle",
    daysAgo: 86,
    views: 1520,
    reactions: { LIKE: 3 },
    replies: [
      {
        author: "tirzepatide_tim",
        body: `Electrolytes (LMNT or equivalent, 1-2 a day first 2 weeks). Ginger tea or candied ginger for nausea. Protein shake ingredients because cooking protein gets hard when appetite drops. Zofran if you have access (not required but nice safety net). Fiber supplement — constipation is sneaky. Scale for morning weigh-ins (optional but motivating).`,
        daysAgo: 86,
        reactions: { USEFUL: 19, THANKS: 8, LIKE: 4 },
      },
      {
        author: "plateau_breaker",
        body: `Cosign. Add: food log app. You think you'll remember what you ate. You won't.`,
        daysAgo: 86,
        reactions: { AGREE: 9, USEFUL: 4 },
      },
      {
        author: "fridge_protein",
        body: `Greek yogurt, cottage cheese, pre-cooked chicken. When you forget to eat at 2pm and suddenly realize you haven't had protein all day, grab-and-eat options save you.`,
        daysAgo: 85,
        reactions: { USEFUL: 13, AGREE: 6 },
      },
      {
        author: "macrosguru",
        body: `Target: 0.8g protein per lb bodyweight. Minimum. If you're 180lb, that's 144g. Without a plan you will not hit it on tirz.`,
        daysAgo: 85,
        reactions: { USEFUL: 11, AGREE: 5 },
      },
      {
        author: "fresh_cycle",
        body: `This is great. Grocery list updated.`,
        daysAgo: 85,
        reactions: { LIKE: 3 },
      },
      {
        author: "sulfur_shrug",
        body: `Random tip: if you start burping sulfur/egg after meals, that's classic tirz. Eat smaller portions, avoid very fatty meals, will usually settle after a few weeks.`,
        daysAgo: 84,
        reactions: { USEFUL: 12, FUNNY: 4 },
      },
      {
        author: "glp1_doctor_pt",
        body: `Miralax or similar laxative, low dose, prn. Constipation is the #2 reason people quit after nausea.`,
        daysAgo: 84,
        reactions: { USEFUL: 10, AGREE: 5 },
      },
      {
        author: "fresh_cycle",
        body: `First shot done. No reaction. thanks for the prep list.`,
        daysAgo: 83,
        reactions: { LIKE: 7, THANKS: 3 },
      },
      {
        author: "slow_lose",
        body: `welcome to the club. electrolytes are non-negotiable.`,
        daysAgo: 83,
        reactions: { AGREE: 4 },
      },
    ],
  },

  {
    title: "Does GHK-Cu actually do anything for hair or is that marketing",
    body: `I see it everywhere for skin + hair. Skin I sort of buy. Hair seems dubious. Real people with real results or are we just funding the supplement industry?`,
    author: "questions_mode",
    daysAgo: 78,
    views: 1260,
    replies: [
      {
        author: "hexaclinic",
        body: `The topical copper peptide literature on hair is mostly in vitro / follicle biology stuff + some small human studies for scalp health. It's not finasteride. For androgenic hair loss it's adjunct at best. Skin benefits (collagen, pigmentation, wound healing) have more consistent data.`,
        daysAgo: 78,
        reactions: { USEFUL: 13, AGREE: 5 },
      },
      {
        author: "showmethestudy",
        body: `Honest answer: if you want to keep your hair, minoxidil + finasteride (or dutasteride) + microneedling have the real evidence. GHK-Cu is a supporting actor, not the lead. Companies market it aggressively because it's not a controlled compound.`,
        daysAgo: 78,
        reactions: { AGREE: 11, USEFUL: 6 },
      },
      {
        author: "citation_required",
        body: `^ this. If someone tells you they "grew their hair back with GHK-Cu only" they're either lying, a unicorn, or also doing other things they're not mentioning.`,
        daysAgo: 78,
        reactions: { AGREE: 9, FUNNY: 4 },
      },
      {
        author: "protocolwonk",
        body: `I run GHK topically post-microneedling and subjectively it helps scalp inflammation and recovery. Not claiming regrowth. Just skin health.`,
        daysAgo: 77,
        reactions: { USEFUL: 6 },
      },
      {
        author: "questions_mode",
        body: `Ok so short answer, not a miracle, useful for skin, mild adjunct for hair if anything. Got it.`,
        daysAgo: 77,
        reactions: { LIKE: 3 },
      },
      {
        author: "dr_doubt",
        body: `That's a fair summary.`,
        daysAgo: 77,
        reactions: { AGREE: 4 },
      },
      {
        author: "nullhypothesis",
        body: `Also: scalp microneedling + minoxidil alone does more than most people realize. Before adding peptides, nail the basics.`,
        daysAgo: 76,
        reactions: { AGREE: 7, USEFUL: 3 },
      },
      {
        author: "panel_maxer",
        body: `Iron, ferritin, and vitamin D pretty much always get overlooked in "hair loss" complaints. Pull labs before you blame genetics.`,
        daysAgo: 76,
        reactions: { USEFUL: 8, AGREE: 4 },
      },
      {
        author: "questions_mode",
        body: `Good call. Booked a lab panel. Will start with the basics before the fancy stuff.`,
        daysAgo: 75,
        reactions: { LIKE: 4, THANKS: 2 },
      },
    ],
  },

  {
    title: "How do I store peptides if I don't have a second fridge",
    body: `Live with roommates and don't want them opening the kitchen fridge and being like "uhhhh what's this". Is a mini fridge the only way or can I be creative`,
    author: "bpc_baby",
    daysAgo: 70,
    views: 1010,
    replies: [
      {
        author: "reggae_fiend",
        body: `1. Opaque container in the back of the kitchen fridge. Nobody's moving the old jar of jam. 2. Mini fridge for your room, $60 on marketplace. 3. If you're dry-powder unopened, room temp short-term is fine for most peptides (weeks not months).`,
        daysAgo: 70,
        reactions: { USEFUL: 12, AGREE: 5 },
      },
      {
        author: "bpc_baby",
        body: `I didn't know dry powder was ok at room temp for a while. That helps.`,
        daysAgo: 70,
        reactions: { LIKE: 2 },
      },
      {
        author: "hexaclinic",
        body: `Dry lyophilized peptide is far more stable than reconstituted. Room temp, dark place, in the mylar pouch it shipped in = fine for weeks, often months. Once reconstituted, fridge.`,
        daysAgo: 70,
        reactions: { USEFUL: 13, AGREE: 6 },
      },
      {
        author: "protocolpilot",
        body: `Trader Joe's dark chocolate box. Nobody touches it. Been my method for 2 years. Reconstituted vials fit next to the eggs.`,
        daysAgo: 69,
        reactions: { FUNNY: 14, LIKE: 6 },
      },
      {
        author: "bpc_baby",
        body: `@protocolpilot that's genius actually`,
        daysAgo: 69,
        reactions: { FUNNY: 5 },
      },
      {
        author: "cautious_ox",
        body: `Mini fridges are great but noise is the catch. The cheapest ones run loud. Worth spending $20 more for a quieter one if it's in your bedroom.`,
        daysAgo: 68,
        reactions: { USEFUL: 7 },
      },
      {
        author: "first_vial",
        body: `I keep mine in a lunch bag with an ice pack in the main fridge. Nobody's opened it.`,
        daysAgo: 68,
        reactions: { USEFUL: 4, FUNNY: 3 },
      },
      {
        author: "bpc_baby",
        body: `Going with the lunch bag method. thanks all.`,
        daysAgo: 66,
        reactions: { LIKE: 3, THANKS: 2 },
      },
    ],
  },

  {
    title: "Stupid question — do I really not need a prescription for this stuff?",
    body: `I keep seeing "research only, not for human use" and I'm confused. Is buying these things legal? Am I going to get a knock on the door?`,
    author: "syringe_shy",
    daysAgo: 62,
    views: 1830,
    reactions: { LIKE: 4 },
    replies: [
      {
        author: "cardinal_rule",
        body: `Short answer: most research peptides exist in a grey zone. They're legal to possess/purchase in the US for research purposes. They are NOT FDA-approved for human use. Suppliers label "research only" to stay on the right side of the law. What people do with their own bodies is their own business. This forum is not for encouraging anyone to do anything — it's for sharing information about what people are already doing.`,
        daysAgo: 62,
        reactions: { USEFUL: 18, AGREE: 9, LIKE: 5 },
      },
      {
        author: "lucidverse",
        body: `Worth adding: some compounds are scheduled or explicitly prohibited. Most research peptides aren't. Controlled substances (e.g. GH itself) are a different story. Stick to the normal research peptides and you're fine.`,
        daysAgo: 62,
        reactions: { USEFUL: 13, AGREE: 5 },
      },
      {
        author: "protocolpilot",
        body: `"Am I going to get a knock on the door" — not from a personal-use purchase of a legal research peptide. The feds are not assembling a strike team for your 5mg BPC vial. Don't resell, don't label stuff as supplements and market it to people, don't import kilograms.`,
        daysAgo: 62,
        reactions: { FUNNY: 15, AGREE: 7 },
      },
      {
        author: "syringe_shy",
        body: `ok good. this was my actual concern. thank you.`,
        daysAgo: 61,
        reactions: { LIKE: 4, THANKS: 2 },
      },
      {
        author: "theoretic",
        body: `One nuance: if you're a licensed professional (nurse, pharmacist, healthcare worker subject to drug testing) the "research only" framing can matter more for you than it does for the average hobbyist. Know your own situation.`,
        daysAgo: 61,
        reactions: { USEFUL: 9, AGREE: 4 },
      },
      {
        author: "dr_doubt",
        body: `Also: insurance and employer drug testing programs occasionally test for things like GH secretagogues if you're in a safety-sensitive role. Peptides per se are not on standard panels, but the ecosystem is changing.`,
        daysAgo: 60,
        reactions: { USEFUL: 7, AGREE: 3 },
      },
      {
        author: "syringe_shy",
        body: `I'm a SWE, not safety sensitive, not tested. ok I feel stupid for being worried but also relieved. onward.`,
        daysAgo: 60,
        reactions: { LIKE: 6, FUNNY: 4 },
      },
      {
        author: "reads_more_posts",
        body: `Not a stupid question. literally the first thing that stopped me from ordering for 6 months was this exact uncertainty.`,
        daysAgo: 58,
        reactions: { AGREE: 8, LIKE: 3 },
      },
      {
        author: "citation_required",
        body: `For anyone finding this later — none of the above is legal advice. It's internet forum opinion. Your jurisdiction may vary, and the laws change. Do your own homework for your country/state.`,
        daysAgo: 56,
        reactions: { AGREE: 6, USEFUL: 3 },
      },
    ],
  },

  {
    title: "Do peptides break a fast?",
    body: `Trying to stick to 16:8. If I inject BPC in the morning before breaking my fast, am I defeating the point? The vial is basically nothing calorically right? But insulin response?`,
    author: "goal_driven",
    daysAgo: 54,
    views: 980,
    replies: [
      {
        author: "hexaclinic",
        body: `Caloric load from a 250mcg BPC dose is effectively zero. Insulin response from a small peptide that isn't a GLP-1/insulin analog is minimal to none. You're fine, BPC doesn't break your fast in any meaningful way.`,
        daysAgo: 54,
        reactions: { USEFUL: 11, AGREE: 5 },
      },
      {
        author: "macrosguru",
        body: `Different story for GLP-1s (tirz, sema) — those directly affect insulin and glucose. But "breaking a fast" with them isn't really a meaningful concern because the entire point is metabolic signaling. Fasting logic doesn't really apply.`,
        daysAgo: 54,
        reactions: { USEFUL: 9, AGREE: 4 },
      },
      {
        author: "goal_driven",
        body: `good distinction. just BPC for me for now.`,
        daysAgo: 53,
        reactions: { LIKE: 2 },
      },
      {
        author: "epi_cycler",
        body: `GH secretagogues (ipamorelin, CJC, tesamorelin) are a hot debate for fasting. Some people say the ghrelin agonism "breaks" a fast in a hormonal sense. Most agree it doesn't break it in the autophagy/metabolic sense. But if you're doing an mTOR-off fast for longevity reasons, a GHRH/ghrelin pulse is going the opposite direction.`,
        daysAgo: 53,
        reactions: { USEFUL: 10, AGREE: 3 },
      },
      {
        author: "nad_nightowl",
        body: `As always: define the goal of your fast. For 16:8 body comp, peptides are basically irrelevant to the fast. For a deep autophagy fast, different conversation.`,
        daysAgo: 52,
        reactions: { AGREE: 7, USEFUL: 3 },
      },
      {
        author: "goal_driven",
        body: `Goal is fat loss + eating discipline. 16:8. So yeah, BPC is fine. thanks.`,
        daysAgo: 52,
        reactions: { LIKE: 3, THANKS: 2 },
      },
      {
        author: "placebo_possible",
        body: `Interesting question: worth noting most of the "breaks a fast" arguments online are pop-physiology with very thin primary sources. Strict calorie definition is ~0. Hormonal definition is squishy and depends who you ask.`,
        daysAgo: 51,
        reactions: { AGREE: 5, USEFUL: 2 },
      },
    ],
  },

  {
    title: "Is it safe to run BPC-157 long term or do I need to cycle off",
    body: `Been on BPC 500mcg/day for 6 weeks and it's been great. A friend said "cycle off or you'll get tolerance/side effects." Another said "BPC is fine forever." Which is it?`,
    author: "joint_hunter",
    daysAgo: 44,
    views: 1540,
    replies: [
      {
        author: "hexaclinic",
        body: `There's no clear evidence of tolerance developing to BPC-157. That said, peptides with healing/growth effects are generally run in cycles (4-8 weeks on, 2-4 weeks off) mostly because (a) you want to see if the baseline issue resolved, (b) conservative principle around long-term growth-promoting signaling, (c) no one has great long-term human data. I wouldn't run it continuously for years personally, but 12 weeks for a real injury isn't the end of the world.`,
        daysAgo: 44,
        reactions: { USEFUL: 14, AGREE: 7, LIKE: 3 },
      },
      {
        author: "showmethestudy",
        body: `The "cycle off" advice is mostly precautionary. We do not have multi-year human safety data on continuous BPC. Anyone saying it's "fine forever" is speculating. Anyone saying "tolerance will develop" is also speculating. We just don't know. Default to conservative.`,
        daysAgo: 44,
        reactions: { AGREE: 11, USEFUL: 6 },
      },
      {
        author: "tendon_theory",
        body: `Practically: I run BPC for 6-8 weeks when there's an issue, stop, reassess. If the issue comes back, run again. Don't run it for "general wellness." There's no evidence it does anything prophylactic.`,
        daysAgo: 43,
        reactions: { AGREE: 9, USEFUL: 5 },
      },
      {
        author: "joint_hunter",
        body: `So stop at 8 weeks, reassess, restart if needed. Got it.`,
        daysAgo: 43,
        reactions: { LIKE: 3 },
      },
      {
        author: "reggae_fiend",
        body: `Gentle push: is this actually fixing a problem or have you just gotten used to running BPC and it feels like a safety net now? 6 weeks "great" could mean your issue resolved weeks ago and you're coasting.`,
        daysAgo: 42,
        reactions: { USEFUL: 8, AGREE: 4 },
      },
      {
        author: "joint_hunter",
        body: `@reggae_fiend honestly… fair. Pain is gone. I'm on it more out of habit now. Stopping.`,
        daysAgo: 42,
        reactions: { LIKE: 7, AGREE: 4, THANKS: 2 },
      },
      {
        author: "protocolwonk",
        body: `That's the biggest beginner trap. "It's working so I'll keep running it forever." Running it when there's a reason = smart. Running it as background noise = not smart.`,
        daysAgo: 42,
        reactions: { AGREE: 13, USEFUL: 5 },
      },
      {
        author: "joint_hunter",
        body: `Thanks for the gut check all. stopping this week.`,
        daysAgo: 41,
        reactions: { LIKE: 6, THANKS: 2 },
      },
    ],
  },

  {
    title: "How do people deal with injection anxiety? I'm three days in and can't get over it",
    body: `Third day of trying to inject BPC. I get the syringe loaded, pinch the skin, and then just… freeze. I know it's an insulin needle and it barely hurts. My brain won't let me do it. Anyone been here?`,
    author: "syringe_shy",
    daysAgo: 34,
    views: 1380,
    reactions: { LIKE: 6, THANKS: 2 },
    replies: [
      {
        author: "quietstorm",
        body: `Very common. A few things that help: 1) do it fast — hesitation makes it worse, count 3-2-1 and commit. 2) numbing cream (LMX 4% or equivalent) for the first few if needed, kills the sensory component. 3) warm the vial in your hand for a minute so the solution isn't cold. 4) pinch firmly. 5) the first week is the hardest, it becomes automatic.`,
        daysAgo: 34,
        reactions: { USEFUL: 15, LIKE: 5, THANKS: 3 },
      },
      {
        author: "petal_push",
        body: `I had the same thing. Did mine in front of a mirror the first time because I needed to see what was happening. Weird but it worked. I don't need to anymore.`,
        daysAgo: 34,
        reactions: { FUNNY: 7, USEFUL: 4, LIKE: 3 },
      },
      {
        author: "first_vial",
        body: `Ice cube on the spot for 30 seconds before injecting. kills sensation, works every time.`,
        daysAgo: 33,
        reactions: { USEFUL: 9, LIKE: 3 },
      },
      {
        author: "nopain_noreign",
        body: `Insulin needles are genuinely one of the smallest needles used clinically. For me what got me over it was actually looking up how small 31 gauge is compared to a hair. It's tiny. My brain was imagining something 10x bigger.`,
        daysAgo: 33,
        reactions: { USEFUL: 7, LIKE: 4 },
      },
      {
        author: "syringe_shy",
        body: `These are all helpful. Going to try the 3-2-1 + warm solution tomorrow morning.`,
        daysAgo: 33,
        reactions: { LIKE: 4 },
      },
      {
        author: "cautious_ox",
        body: `Had to do the first 4 in my thigh because I couldn't stomach the belly. Eventually moved to belly once the fear faded. There's no rule that says you can't pick your easiest site first.`,
        daysAgo: 33,
        reactions: { USEFUL: 6, AGREE: 3 },
      },
      {
        author: "syringe_shy",
        body: `Did it this morning. Didn't feel anything. I was being dramatic apparently.`,
        daysAgo: 32,
        reactions: { LIKE: 11, FUNNY: 6, THANKS: 3 },
      },
      {
        author: "quietstorm",
        body: `^ the universal experience. Welcome to the other side.`,
        daysAgo: 32,
        reactions: { LIKE: 8, FUNNY: 5 },
      },
      {
        author: "reads_more_posts",
        body: `Saving this thread for when I start. thanks all.`,
        daysAgo: 28,
        reactions: { THANKS: 4, LIKE: 2 },
      },
      {
        author: "late_bloomer_m",
        body: `Late to this but 47M here, was scared of needles my whole life. insulin syringe was nothing like I feared. Anyone reading: it's ok to be scared, and it's also ok once you do it.`,
        daysAgo: 16,
        reactions: { LIKE: 9, THANKS: 4 },
      },
    ],
  },

  // ============================================================
  // QUIET THREADS — 2-5 replies each, 16 threads
  // ============================================================

  {
    title: "Are there any peptides for sleep that actually work?",
    body: `Tried melatonin, magnesium, the whole OTC stack. Wondering if DSIP or something is actually worth trying.`,
    author: "lost_my_reps",
    daysAgo: 132,
    views: 710,
    replies: [
      {
        author: "restwise",
        body: `DSIP is hit or miss and a lot of people report vivid/disturbing dreams. Epitalon is often talked about but the sleep benefit is secondary to its proposed longevity effects. Honestly, if standard sleep hygiene + magnesium glycinate + apigenin doesn't fix it, the peptide probably isn't the missing piece. Might be sleep apnea, cortisol, or late caffeine.`,
        daysAgo: 132,
        reactions: { USEFUL: 12, AGREE: 6 },
      },
      {
        author: "dreamline",
        body: `DSIP worked for me for about 2 weeks then stopped. pattern you'll see a lot. it's not a long-term solution.`,
        daysAgo: 131,
        reactions: { USEFUL: 5, AGREE: 3 },
      },
      {
        author: "epi_cycler",
        body: `Have you done a sleep study? A lot of "I've tried everything" sleep problems turn out to be mild apnea.`,
        daysAgo: 131,
        reactions: { USEFUL: 7, AGREE: 4 },
      },
      {
        author: "lost_my_reps",
        body: `haven't. I'll look into that first. thanks.`,
        daysAgo: 130,
        reactions: { LIKE: 3, THANKS: 2 },
      },
      {
        author: "humanin_hope",
        body: `Also look at your morning cortisol if you wake up at 3am. Peptides can't out-cycle a cortisol problem.`,
        daysAgo: 129,
        reactions: { USEFUL: 6, AGREE: 3 },
      },
    ],
  },

  {
    title: "Injection site bruising — normal?",
    body: `Bruised about half my injections so far. Not huge bruises, little purple marks. Is this a technique thing?`,
    author: "cautious_ox",
    daysAgo: 126,
    views: 420,
    replies: [
      {
        author: "nopain_noreign",
        body: `Usually means you nicked a capillary on the way in. Common, not dangerous. Rotate sites, go slower, try a different angle. If you take fish oil or aspirin, you'll bruise more.`,
        daysAgo: 126,
        reactions: { USEFUL: 9, AGREE: 3 },
      },
      {
        author: "cautious_ox",
        body: `I do take fish oil. That might be it.`,
        daysAgo: 126,
        reactions: { LIKE: 2 },
      },
      {
        author: "hexaclinic",
        body: `Fish oil is a big one. Time injections away from your dose if you want to test it.`,
        daysAgo: 125,
        reactions: { USEFUL: 4 },
      },
      {
        author: "weekendwarrior_p",
        body: `warming the solution helped me a lot too. cold liquid into tissue = more bruising in my experience.`,
        daysAgo: 124,
        reactions: { USEFUL: 4, AGREE: 2 },
      },
    ],
  },

  {
    title: "Stack question — can BPC and TB500 go in the same syringe",
    body: `Want to save on injections. Compatible?`,
    author: "stackbuilder",
    daysAgo: 119,
    views: 890,
    replies: [
      {
        author: "protocolwonk",
        body: `Yes, commonly done. Both are water-soluble peptides, no precipitation when mixed. Draw BPC first, then TB500, inject. You could also pre-mix a combo vial if you're comfortable with that.`,
        daysAgo: 119,
        reactions: { USEFUL: 11, AGREE: 4 },
      },
      {
        author: "stackbuilder",
        body: `perfect thanks`,
        daysAgo: 119,
        reactions: { THANKS: 2 },
      },
      {
        author: "hexaclinic",
        body: `Don't combine with GHK-Cu in the same syringe though — the copper can interact with other peptides and discolor the solution.`,
        daysAgo: 118,
        reactions: { USEFUL: 8, AGREE: 3 },
      },
    ],
  },

  {
    title: "What's a realistic timeline to see skin improvements from GHK-Cu?",
    body: `Just for "glow" / texture. Month? Three months? Never?`,
    author: "petal_push",
    daysAgo: 103,
    views: 680,
    replies: [
      {
        author: "protocolwonk",
        body: `Topical GHK-Cu (serum/cream) at reasonable concentrations, expect 6-8 weeks for visible texture/tone shifts. Injected GHK for systemic skin effects — more variable, usually 8-12 weeks. Don't expect overnight miracles.`,
        daysAgo: 103,
        reactions: { USEFUL: 9, AGREE: 3 },
      },
      {
        author: "showmethestudy",
        body: `Honestly, tretinoin + SPF + sleep + not destroying your skin barrier will do more than most peptides. GHK is nice. It's not magic.`,
        daysAgo: 102,
        reactions: { AGREE: 7, USEFUL: 3 },
      },
      {
        author: "petal_push",
        body: `Running tret already. wanted something to layer. thanks.`,
        daysAgo: 102,
        reactions: { LIKE: 2 },
      },
    ],
  },

  {
    title: "weirdly metallic taste after injection. anyone else",
    body: `literally 15 seconds after injecting GHK-Cu I get a metallic taste in my mouth. gone in a minute. weird?`,
    author: "bpc_baby",
    daysAgo: 94,
    views: 410,
    replies: [
      {
        author: "hexaclinic",
        body: `GHK-Cu specifically — the copper can cause a transient metallic taste. Well-documented. Harmless. It's the compound, not you.`,
        daysAgo: 94,
        reactions: { USEFUL: 11, LIKE: 3 },
      },
      {
        author: "bpc_baby",
        body: `oh that's actually really interesting. thanks`,
        daysAgo: 94,
        reactions: { LIKE: 2, THANKS: 2 },
      },
      {
        author: "reggae_fiend",
        body: `first time i got this I thought i was dying. it's just the copper.`,
        daysAgo: 93,
        reactions: { FUNNY: 7 },
      },
      {
        author: "protocolwonk",
        body: `If the taste persists for hours or you feel nauseous, that's a different conversation. Transient metallic = copper, fine.`,
        daysAgo: 93,
        reactions: { USEFUL: 5, AGREE: 2 },
      },
    ],
  },

  {
    title: "How do I dispose of used syringes if I don't have a sharps container yet",
    body: `ordered one, hasn't arrived. what do I do meanwhile`,
    author: "first_vial",
    daysAgo: 80,
    views: 430,
    replies: [
      {
        author: "lucidverse",
        body: `Laundry detergent jug or empty bleach bottle. Heavy plastic, screw cap, opaque. Label with a sharpie "SHARPS - DO NOT RECYCLE." Transfer into proper container when it arrives. Never loose in trash.`,
        daysAgo: 80,
        reactions: { USEFUL: 14, AGREE: 6, LIKE: 3 },
      },
      {
        author: "first_vial",
        body: `perfect, have an empty detergent jug. thanks.`,
        daysAgo: 80,
        reactions: { THANKS: 2 },
      },
      {
        author: "hexaclinic",
        body: `Also: most cities have free sharps drop-off at pharmacies or health departments. Don't throw even the full detergent jug in regular trash.`,
        daysAgo: 79,
        reactions: { USEFUL: 7, AGREE: 3 },
      },
    ],
  },

  {
    title: "Is there a peptide for anxiety that isn't selank or semax",
    body: `Tried both, got mild effects, looking for what else is out there.`,
    author: "selank_silence",
    daysAgo: 72,
    views: 820,
    replies: [
      {
        author: "semax_mornings",
        body: `If semax/selank at appropriate doses only got you mild effects, more exotic options probably won't blow you away either. Cerebrolysin is the obvious "deeper" option but it's 10 days IM daily and subjectively much more intense. Not for casual use.`,
        daysAgo: 72,
        reactions: { USEFUL: 9, AGREE: 4 },
      },
      {
        author: "noots_noop",
        body: `Also worth looking outside peptides — if you've only tried nootropics-adjacent stuff, things like L-theanine, apigenin, or non-peptide interventions (SSRIs, therapy, meditation) move anxiety more reliably than the nootropic class does. I say this as someone who has spent money on both.`,
        daysAgo: 71,
        reactions: { USEFUL: 11, AGREE: 6 },
      },
      {
        author: "cerebrolysin_cb",
        body: `Cerebrolysin is a commitment. Worth it for some, excessive for others. Don't run it as your first exotic.`,
        daysAgo: 70,
        reactions: { USEFUL: 6, AGREE: 3 },
      },
      {
        author: "selank_silence",
        body: `Fair. I'll stick with selank and look at lifestyle stuff.`,
        daysAgo: 70,
        reactions: { LIKE: 3, AGREE: 2 },
      },
    ],
  },

  {
    title: "Can I freeze reconstituted peptides to make them last longer",
    body: `got a 10mg vial and I don't need a month's worth, could I freeze half?`,
    author: "protocolpilot",
    daysAgo: 42,
    views: 560,
    replies: [
      {
        author: "hexaclinic",
        body: `Yes for most peptides, with caveats. Use sterile vials, aliquot before freezing, freeze deep (-20C home freezer is fine for weeks, not ideal for months). Avoid freeze-thaw cycles — thaw what you need, use it, don't refreeze. GHK-Cu and thymosins are less freeze-friendly; for BPC and most others it works.`,
        daysAgo: 42,
        reactions: { USEFUL: 13, LIKE: 4, AGREE: 3 },
      },
      {
        author: "protocolpilot",
        body: `perfect. aliquoting into 5 vials this weekend.`,
        daysAgo: 42,
        reactions: { LIKE: 3 },
      },
      {
        author: "dr_doubt",
        body: `Label everything with dates + contents. Mystery vials in the freezer 6 months later are a crisis waiting to happen.`,
        daysAgo: 41,
        reactions: { AGREE: 7, FUNNY: 5 },
      },
    ],
  },

  {
    title: "my partner saw my vial and asked if I was doing steroids",
    body: `how do I explain peptides in a normal-sounding way? they're not steroids, I'm not trying to hide anything, I just want to explain without it sounding fringe.`,
    author: "late_bloomer_m",
    daysAgo: 26,
    views: 1020,
    reactions: { LIKE: 5 },
    replies: [
      {
        author: "lucidverse",
        body: `"Peptides are short proteins. Some of them help with injury recovery (BPC), some help with body composition like the newer GLP-1 drugs your friends are on (tirz/sema/reta), some are used for skin/hair. They're not anabolic steroids, which are modified testosterone analogs. They don't carry the same risk profile. I do [specific thing] for [specific reason]."`,
        daysAgo: 26,
        reactions: { USEFUL: 12, LIKE: 5 },
      },
      {
        author: "reggae_fiend",
        body: `"honey, GLP-1 is literally what Oprah is on" has ended more debates than I can count`,
        daysAgo: 26,
        reactions: { FUNNY: 18, LIKE: 6 },
      },
      {
        author: "late_bloomer_m",
        body: `@reggae_fiend hah, I'm on BPC for my back, not a GLP-1. but I'll steal the framing.`,
        daysAgo: 25,
        reactions: { FUNNY: 5 },
      },
      {
        author: "petal_push",
        body: `the fact that pharma-branded GLP-1 is now mainstream has made peptides way easier to explain to family. "same mechanism as what your sister's doctor prescribed" lands better than a biochem lecture.`,
        daysAgo: 25,
        reactions: { AGREE: 10, USEFUL: 4 },
      },
      {
        author: "late_bloomer_m",
        body: `update: showed her the supplier COA, explained what it was. she was fine. the steroid word was just the first thing she reached for.`,
        daysAgo: 22,
        reactions: { LIKE: 8, THANKS: 2 },
      },
    ],
  },

  {
    title: "Does bac water go bad? My bottle has been open 3 weeks",
    body: `mostly full still. is it still good?`,
    author: "bac_water_noob",
    daysAgo: 19,
    views: 380,
    replies: [
      {
        author: "hexaclinic",
        body: `Bacteriostatic water is 0.9% benzyl alcohol + sterile water. Once opened, stability is usually 28 days per manufacturer spec. After that, the bacteriostatic agent concentration drops enough that it's no longer reliably preserving. Fresh bottles are like $3. Just pitch it.`,
        daysAgo: 19,
        reactions: { USEFUL: 11, AGREE: 4, LIKE: 2 },
      },
      {
        author: "bac_water_noob",
        body: `ok, pitching. thanks.`,
        daysAgo: 19,
        reactions: { THANKS: 2 },
      },
      {
        author: "first_vial",
        body: `I draw a little line on my bac vial + date when I open it. never have to guess.`,
        daysAgo: 18,
        reactions: { USEFUL: 5 },
      },
    ],
  },

  // ============================================================
  // LOCKED THREAD — FAQ-style solved compendium
  // ============================================================
  {
    title: "[LOCKED - reference] FAQ compendium: the top 20 beginner questions, answered",
    body: `Thread is locked to keep the reference clean. If you have a question not on here, open a new thread. Will update this occasionally.

**1. Do I need a prescription?** For research peptides — generally no in the US. Not FDA-approved for human use. YMMV by jurisdiction.

**2. SubQ or IM?** SubQ for almost everything. Belly fat pad, insulin needle (29-31G x 5/16").

**3. How do I do reconstitution math?** Concentration (mg/mL) = mg on vial / mL of bac water added. Then dose in mcg / concentration in mcg/mL = mL per dose. Units on a U-100 syringe = mL × 100.

**4. How long does a reconstituted vial last?** 30 days fridge for most. 2-3 weeks for fragile ones (GHK-Cu, some thymosins). Label with date.

**5. Do I have to inject in the morning?** Only if it's a GH secretagogue (night), a stimulant-ish peptide (morning), or you care. Otherwise, consistency > timing.

**6. BPC-157 dose for beginners?** 250mcg 2x/day SubQ is a common, safe starting dose. Site-specific injection helps for local injuries.

**7. TB500 dose?** Typical loading: 2-2.5mg/week in 2-3 divided doses for 4-6 weeks, then maintenance at lower dose if continuing.

**8. Tirz/sema starting dose?** Tirz: 2.5mg/week x 4 weeks. Sema: 0.25mg/week x 4 weeks. Titrate up slowly. Don't skip titration.

**9. Do peptides show on drug tests?** Standard panels: no. WADA / elite sport panels: yes for some (GH secretagogues, GLP-1s, others). Know your testing program.

**10. Can I mix peptides in one syringe?** Usually yes for water-soluble compatible peptides (BPC + TB500 is classic). Don't mix GHK-Cu with others.

**11. Shake or swirl?** Swirl. Shake won't destroy small peptides but can foam and you lose dose.

**12. Freeze or fridge?** Fridge for active use. Freeze aliquots for long-term storage of most peptides. Not all freeze well.

**13. Bruising normal?** Yes, occasional bruising from capillary hits is normal. Fish oil + aspirin worsen it.

**14. Lump at injection site?** Usually subcutaneous infiltrate, resolves in days. Red + hot + worsening = possible infection, seek care.

**15. Do I need to cycle?** Conservative default: 6-8 weeks on, 2-4 weeks off for growth-adjacent peptides. GLP-1s are more commonly run continuously.

**16. Injection anxiety — how do I get past it?** 3-2-1 and commit. Warm solution. Pinch firmly. First week is hardest.

**17. Does bac water expire?** 28 days after opening per manufacturer. $3/bottle, replace regularly.

**18. What's a COA?** Certificate of Analysis. Shows purity/identity of a batch. Reputable suppliers provide them.

**19. How do I store syringes / needles?** Dry, room temp, out of direct sun. Sealed packs are fine until expiry (usually 5 years).

**20. How do I dispose of syringes?** Sharps container. Empty laundry jug labeled SHARPS works meanwhile. Free drop-off at most pharmacies.

If an answer here is wrong or needs updating, DM a mod. Thread locked.`,
    author: "lucidverse",
    daysAgo: 120,
    locked: true,
    views: 6420,
    reactions: { LIKE: 15, USEFUL: 15, THANKS: 14, AGREE: 9 },
    replies: [
      {
        author: "cardinal_rule",
        body: `Locking. This is the reference. For any follow-ups, please open new threads in the appropriate category. Thanks lucidverse.`,
        daysAgo: 120,
        reactions: { AGREE: 12, LIKE: 6 },
      },
      {
        author: "hexaclinic",
        body: `Nit for #7 — 2-2.5mg/week loading is on the higher end of what people do. Many start at 1-1.5mg/week divided and titrate up. Would soften that one.`,
        daysAgo: 119,
        reactions: { USEFUL: 8, AGREE: 4 },
      },
      {
        author: "lucidverse",
        body: `@hexaclinic noted. will revise on next pass.`,
        daysAgo: 119,
        reactions: { AGREE: 5 },
      },
      {
        author: "protocolpilot",
        body: `Excellent resource. Linking this from the welcome DM going forward.`,
        daysAgo: 118,
        reactions: { LIKE: 7, AGREE: 3 },
      },
    ],
  },

  // ============================================================
  // A few more quiet threads to hit 32 total
  // ============================================================

  {
    title: "my vial arrived and there's a divot in the top of the powder — ok?",
    body: `like the powder isn't flat, there's a little crater. is this normal from shipping vibration or did something go wrong`,
    author: "first_vial",
    daysAgo: 15,
    views: 280,
    replies: [
      {
        author: "hexaclinic",
        body: `Totally normal. Lyophilization creates a "cake" and shipping vibration can shift it. As long as the cake is whole and not powder-y/dusty, you're fine.`,
        daysAgo: 15,
        reactions: { USEFUL: 7, LIKE: 2 },
      },
      {
        author: "first_vial",
        body: `phew, reconstituting tonight then. thanks.`,
        daysAgo: 15,
        reactions: { LIKE: 2, THANKS: 2 },
      },
      {
        author: "reggae_fiend",
        body: `if it arrived as a pile of loose powder vs a solid cake, that's the concerning version. divot is fine.`,
        daysAgo: 14,
        reactions: { USEFUL: 4, AGREE: 2 },
      },
      {
        author: "mothra",
        body: `Summer shipping = more shift. Winter shipping = more intact cakes. Not a quality issue, just physics.`,
        daysAgo: 13,
        reactions: { USEFUL: 3, LIKE: 2 },
      },
    ],
  },

  {
    title: "n00b crossposting — saw the BPC thread last month, now I'm having the same exact issue",
    body: `referencing @rotator_rebuild's thread — 36M, same supraspinatus partial tear from benching. Ordered BPC. Going to follow the same protocol they did (site-specific, 250mcg 2x/day). Anything I should do differently given ~a month has passed and people have tried it?`,
    author: "shoulder_spring",
    daysAgo: 11,
    views: 410,
    reactions: { LIKE: 4 },
    replies: [
      {
        author: "tendon_theory",
        body: `Nothing to change. The protocol in that thread is the current consensus for rotator issues. Stick with PT in parallel. Report back at 4 and 8 weeks for the rest of us.`,
        daysAgo: 11,
        reactions: { USEFUL: 6, AGREE: 3 },
      },
      {
        author: "rotator_rebuild",
        body: `Happy to answer anything specific. the one thing I'd say: don't overdo activity week 1-2 just because it doesn't hurt as much. The peptide isn't magic, tendon remodeling still takes time. PT pace > hero pace.`,
        daysAgo: 10,
        reactions: { USEFUL: 11, AGREE: 5, THANKS: 3 },
      },
      {
        author: "shoulder_spring",
        body: `@rotator_rebuild appreciate it. noted.`,
        daysAgo: 10,
        reactions: { THANKS: 2 },
      },
      {
        author: "reads_more_posts",
        body: `love when threads reference other threads like this. feels like a real community not a pile of duplicate posts.`,
        daysAgo: 9,
        reactions: { AGREE: 7, LIKE: 3 },
      },
    ],
  },

  {
    title: "help — I drew up 40 units instead of 10. do I inject it??",
    body: `panicking. did the math wrong. pulled 4x my dose. obviously not injecting that but can I push it back into the vial???`,
    author: "bpc_baby",
    daysAgo: 6,
    views: 720,
    reactions: { FUNNY: 5 },
    replies: [
      {
        author: "lucidverse",
        body: `DO NOT push it back into the vial. You've touched the needle to your skin/air, the plunger has been pulled, you'd contaminate the vial. Pitch the syringe, draw a new 10 units, inject that. You lose 40 units' worth of peptide this once. Worth the lesson.`,
        daysAgo: 6,
        reactions: { USEFUL: 16, AGREE: 7, LIKE: 4 },
      },
      {
        author: "bpc_baby",
        body: `ok pitching. I feel dumb.`,
        daysAgo: 6,
        reactions: { LIKE: 2 },
      },
      {
        author: "dr_doubt",
        body: `Everyone has done this once. Consider it the peptide community's hazing ritual. You'll triple-check the syringe for the next 20 doses and it'll never happen again.`,
        daysAgo: 6,
        reactions: { FUNNY: 14, AGREE: 6, LIKE: 3 },
      },
      {
        author: "bpc_baby",
        body: `thanks all, new syringe done, correct dose. moving on with my life.`,
        daysAgo: 6,
        reactions: { LIKE: 8, FUNNY: 4, THANKS: 2 },
      },
    ],
  },

  {
    title: "is it normal to feel nothing at all on BPC? week 3",
    body: `running for a chronic SI joint thing, 500mcg/day split, week 3, zero change. do I give up or push to 6 weeks?`,
    author: "joint_hunter",
    daysAgo: 4,
    views: 320,
    replies: [
      {
        author: "tendon_theory",
        body: `3 weeks is early. Push to 6. SI joint stuff is also weird because the "joint" isn't really healing in the same way a tendon does — chronic SI pain is often stability/mechanical rather than tissue damage. BPC may not be the right tool for this goal.`,
        daysAgo: 4,
        reactions: { USEFUL: 9, AGREE: 4 },
      },
      {
        author: "hexaclinic",
        body: `Agree with tendon_theory. What's your diagnosis — actual sacroiliitis, or "SI pain" as a catchall? If it's mechanical/stability, PT for glutes + core is doing more than any peptide will.`,
        daysAgo: 4,
        reactions: { USEFUL: 7, AGREE: 3 },
      },
      {
        author: "joint_hunter",
        body: `haven't had a real workup tbh. just been calling it SI pain for years. fair point, maybe worth seeing someone before throwing more compounds at it.`,
        daysAgo: 3,
        reactions: { AGREE: 5, LIKE: 3 },
      },
      {
        author: "showmethestudy",
        body: `"BPC isn't doing anything" is often a sign that the problem isn't what we think it is. Good instinct to pause and diagnose.`,
        daysAgo: 3,
        reactions: { AGREE: 8, USEFUL: 4 },
      },
      {
        author: "back_on_the_mat",
        body: `been there on SI stuff. ended up being a glute med weakness that PT fixed in 10 weeks, no peptides required. fingers crossed for you.`,
        daysAgo: 2,
        reactions: { USEFUL: 6, LIKE: 3, THANKS: 2 },
      },
    ],
  },
];
