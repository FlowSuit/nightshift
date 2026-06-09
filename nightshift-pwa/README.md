# NightShift - Deploy Gids

Party drinkspel voor 4-20 spelers. Iedereen op eigen telefoon via QR-code of kamercode.

## Wat je nodig hebt

- [Supabase account](https://supabase.com) (gratis)
- [Vercel account](https://vercel.com) (gratis)
- [GitHub account](https://github.com) (voor deploy via Vercel)

---

## Stap 1: Supabase instellen

1. Ga naar [supabase.com](https://supabase.com) → **Start your project** → gratis account
2. Klik **New project** → vul een naam in (bv. `nightshift`) → kies een wachtwoord → **Create new project**
3. Wacht tot het project klaar is (~2 min)
4. Ga naar **Project Settings** (tandwiel icoon) → **API**
5. Kopieer:
   - **Project URL** (ziet eruit als `https://abcdefgh.supabase.co`)
   - **anon public** key (lange string)

**Geen tabellen of database nodig** - NightShift gebruikt alleen Supabase Realtime Broadcast, dat werkt out-of-the-box.

---

## Stap 2: Project uploaden naar GitHub

1. Pak het `nightshift-pwa` mapje uit
2. Ga naar [github.com](https://github.com) → **New repository** → naam `nightshift` → **Create**
3. Upload alle bestanden (drag & drop op GitHub, of via terminal):
   ```bash
   cd nightshift-pwa
   git init
   git add .
   git commit -m "NightShift v1"
   git remote add origin https://github.com/JOUWGEBRUIKER/nightshift.git
   git push -u origin main
   ```

---

## Stap 3: Deploy naar Vercel

1. Ga naar [vercel.com](https://vercel.com) → **Add New Project**
2. Importeer je GitHub repository `nightshift`
3. Bij **Environment Variables** voeg toe:
   - `VITE_SUPABASE_URL` → jouw Project URL uit stap 1
   - `VITE_SUPABASE_ANON_KEY` → jouw anon key uit stap 1
4. Klik **Deploy** → wacht ~1 minuut
5. Je krijgt een URL zoals `nightshift.vercel.app` 🎉

---

## Stap 4: Op je telefoon installeren (PWA)

**iPhone/iPad:**
1. Open de app-URL in Safari
2. Tap het deel-icoon (vierkantje met pijl omhoog)
3. Tap **Voeg toe aan beginscherm**

**Android:**
1. Open de app-URL in Chrome
2. Tap de drie puntjes rechtsbovenin
3. Tap **App installeren** of **Toevoegen aan beginscherm**

---

## Hoe het werkt

1. **Host** opent de app → tikt **KAMER MAKEN** → vult naam in
2. Een 4-letterige kamercode (bv. `KWRT`) + QR-code verschijnt
3. **Andere spelers** scannen de QR-code of gaan naar de URL en voeren de code in
4. Zodra iedereen in de lobby staat: host tikt **START DE AVOND**
5. Host selecteert spelmodes, anderen spelen mee op eigen scherm

### Per-telefoon interacties
- **Never Have I Ever**: iedereen stemt WEL/NIET op eigen telefoon tegelijk
- **Beste Antwoord**: iedereen typt antwoord op eigen telefoon tegelijk  
- **Andere modes**: host beheert het spel, iedereen leest de opdracht op eigen scherm

---

## Lokaal testen

```bash
cd nightshift-pwa
cp .env.example .env
# Vul je Supabase URL en key in in .env
npm install
npm run dev
```

Open `http://localhost:5173` in twee tabbladen om host + client te testen.
