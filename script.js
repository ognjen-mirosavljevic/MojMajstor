// Ognjen Mirosavljevic

document.addEventListener("DOMContentLoaded", function () {
    inicijalizujPodatke();

    const korisnik = preuzmiUlogovanogKorisnika();
    prikaziImeKorisnika(korisnik);
    inicijalizujNotifikacije();

    const params = new URLSearchParams(window.location.search);

    const majstori = preuzmiMajstore();

    inicijalizujRegistraciju();
    inicijalizujLogin();
    inicijalizujLogout();
    inicijalizujProfilKorisnika();
    inicijalizujProfilMajstora(params, majstori);
    inicijalizujFormuZaKreiranje(params, majstori, korisnik);

    prikaziSveZahteve();
    prikaziDetaljZahteva(params);
});


// ======================================================
// INICIJALNI PODACI
// ======================================================

function inicijalizujPodatke() {
    if (!localStorage.getItem("korisnici")) {
        const pocetniKorisnici = [
            {
                id: "1",
                username: "ognjen",
                password: "123",
                uloga: "korisnik",
                ime: "Ognjen",
                prezime: "Mirosavljević",
                email: "ognjen@gmail.com",
                telefon: "0601234567",
                grad: "Požarevac",
                adresa: "Centar bb"
            },
            {
                id: "2",
                username: "marko",
                password: "123",
                uloga: "majstor",
                ime: "Marko",
                prezime: "Petrović",
                email: "marko@gmail.com",
                telefon: "0611111111",
                grad: "Beograd",
                adresa: "Voždovac bb"
            }
        ];

        localStorage.setItem("korisnici", JSON.stringify(pocetniKorisnici));
    }

    if (!localStorage.getItem("majstori")) {
        const majstori = [
            {
                id: "101",
                korisnikId: "2",
                ime: "Marko Petrović",
                kategorija: "Vodoinstalater",
                lokacija: "Voždovac",
                opis: "Iskusan vodoinstalater za hitne i redovne intervencije.",
                ocena: 4.5
            },
            {
                id: "102",
                korisnikId: "3",
                ime: "Nikola Jovanović",
                kategorija: "Električar",
                lokacija: "Zvezdara",
                opis: "Električne instalacije, kvarovi i zamena osigurača.",
                ocena: 4.0
            },
            {
                id: "103",
                korisnikId: "4",
                ime: "Milan Ilić",
                kategorija: "Serviser bojlera",
                lokacija: "Novi Beograd",
                opis: "Servis i popravka bojlera svih proizvođača.",
                ocena: 4.2
            },
            {
                id: "104",
                korisnikId: "5",
                ime: "Petar Nikolić",
                kategorija: "Moler",
                lokacija: "Palilula",
                opis: "Krečenje, gletovanje i sređivanje enterijera.",
                ocena: 4.8
            }
        ];

        localStorage.setItem("majstori", JSON.stringify(majstori));
    }

    if (!localStorage.getItem("ocene")) {
    const ocene = [
        { majstorId: "101", vrednost: 5 },
        { majstorId: "101", vrednost: 4 },
        { majstorId: "101", vrednost: 5 },
        { majstorId: "102", vrednost: 3 }
    ];

    localStorage.setItem("ocene", JSON.stringify(ocene));
}

    if (!localStorage.getItem("zahtevi")) {
        const pocetniZahtevi = [
            {
                id: "201",
                naslov: "Popravka slavine",
                majstorId: "101",
                majstor: "Marko Petrović",
                lokacija: "Voždovac",
                adresa: "Bulevar oslobođenja 12",
                opis: "Slavina curi već dva dana.",
                status: "Na čekanju",
                korisnikId: "1"
            },
            {
                id: "202",
                naslov: "Električne instalacije",
                majstorId: "102",
                majstor: "Nikola Jovanović",
                lokacija: "Zvezdara",
                adresa: "Mite Ružića 4",
                opis: "Ne radi utičnica u kuhinji.",
                status: "Prihvaćen",
                korisnikId: "1"
            }
        ];

        localStorage.setItem("zahtevi", JSON.stringify(pocetniZahtevi));
    }
}


// ======================================================
// POMOĆNE FUNKCIJE
// ======================================================

function preuzmiUlogovanogKorisnika() {
    return JSON.parse(localStorage.getItem("ulogovaniKorisnik"));
}

function sacuvajUlogovanogKorisnika(korisnik) {
    localStorage.setItem("ulogovaniKorisnik", JSON.stringify(korisnik));
}

function preuzmiKorisnike() {
    return JSON.parse(localStorage.getItem("korisnici")) || [];
}

function sacuvajKorisnike(korisnici) {
    localStorage.setItem("korisnici", JSON.stringify(korisnici));
}

function preuzmiMajstore() {
    return JSON.parse(localStorage.getItem("majstori")) || [];
}

function preuzmiZahteve() {
    return JSON.parse(localStorage.getItem("zahtevi")) || [];
}

function sacuvajZahteve(zahtevi) {
    localStorage.setItem("zahtevi", JSON.stringify(zahtevi));
}


// ======================================================
// NAVBAR / KORISNIK
// ======================================================

function prikaziImeKorisnika(korisnik) {
    const userNameSpan = document.getElementById("userName");
    if (!userNameSpan || !korisnik) return;

    userNameSpan.textContent = korisnik.ime || korisnik.username || "Korisnik";
}

function inicijalizujNotifikacije() {
    const badge = document.getElementById("notifCount");
    if (!badge) return;

    const brojNotifikacija = 3;

    if (brojNotifikacija > 0) {
        badge.textContent = brojNotifikacija;
    } else {
        badge.style.display = "none";
    }
}

function inicijalizujLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("ulogovaniKorisnik");
        window.location.href = "index.html";
    });
}


// ======================================================
// REGISTRACIJA
// ======================================================

function inicijalizujRegistraciju() {
    const registracijaForma = document.getElementById("registracijaForma");
    if (!registracijaForma) return;

    registracijaForma.addEventListener("submit", function (e) {
        e.preventDefault();

        const usernameInput = document.getElementById("regUsername");
        const passwordInput = document.getElementById("regPassword");
        const password2Input = document.getElementById("regPassword2");
        const ulogaInput = document.querySelector('input[name="uloga"]:checked');

        if (!usernameInput || !passwordInput || !password2Input || !ulogaInput) {
            alert("Forma nije dobro povezana.");
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const password2 = password2Input.value.trim();
        const uloga = ulogaInput.value;

        if (!username || !password || !password2) {
            alert("Popunite sva polja.");
            return;
        }

        if (password !== password2) {
            alert("Lozinke se ne poklapaju.");
            return;
        }

        const korisnici = preuzmiKorisnike();

        const postoji = korisnici.find(
            k => k.username.toLowerCase() === username.toLowerCase()
        );

        if (postoji) {
            alert("Korisničko ime već postoji.");
            return;
        }

        const noviKorisnik = {
            id: Date.now().toString(),
            username: username,
            password: password,
            uloga: uloga,
            ime: username,
            prezime: "",
            email: "",
            telefon: "",
            grad: "",
            adresa: ""
        };

        korisnici.push(noviKorisnik);
        sacuvajKorisnike(korisnici);

        alert("Uspešna registracija.");
        window.location.href = "login.html";
    });
}


// ======================================================
// LOGIN
// ======================================================

function inicijalizujLogin() {
    const loginForma = document.getElementById("loginForma");
    if (!loginForma) return;

    loginForma.addEventListener("submit", function (e) {
        e.preventDefault();

        const usernameInput = document.getElementById("loginUsername");
        const passwordInput = document.getElementById("loginPassword");

        if (!usernameInput || !passwordInput) {
            alert("Forma nije dobro povezana.");
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const korisnici = preuzmiKorisnike();

        const korisnik = korisnici.find(
            k => k.username === username && k.password === password
        );

        if (!korisnik) {
            alert("Pogrešno korisničko ime ili lozinka.");
            return;
        }

        sacuvajUlogovanogKorisnika({
            id: korisnik.id,
            username: korisnik.username,
            ime: korisnik.ime || korisnik.username,
            prezime: korisnik.prezime || "",
            email: korisnik.email || "",
            telefon: korisnik.telefon || "",
            grad: korisnik.grad || "",
            adresa: korisnik.adresa || "",
            uloga: korisnik.uloga
        });

        if (korisnik.uloga === "majstor") {
            window.location.href = "indexMajstor.html";
        } else {
            window.location.href = "indexKorisnik.html";
        }
    });
}


// ======================================================
// PROFIL KORISNIKA
// ======================================================

function inicijalizujProfilKorisnika() {
    const forma = document.getElementById("profilForma");
    if (!forma) return;

    const korisnik = preuzmiUlogovanogKorisnika();
    if (!korisnik) {
        alert("Morate biti ulogovani.");
        window.location.href = "login.html";
        return;
    }

    const sviKorisnici = preuzmiKorisnike();
    const praviKorisnik = sviKorisnici.find(k => String(k.id) === String(korisnik.id));

    if (!praviKorisnik) return;

    const imeInput = document.getElementById("profilIme");
    const prezimeInput = document.getElementById("profilPrezime");
    const usernameInput = document.getElementById("profilUsername");
    const emailInput = document.getElementById("profilEmail");
    const telefonInput = document.getElementById("profilTelefon");
    const gradInput = document.getElementById("profilGrad");
    const adresaInput = document.getElementById("profilAdresa");

    if (imeInput) imeInput.value = praviKorisnik.ime || "";
    if (prezimeInput) prezimeInput.value = praviKorisnik.prezime || "";
    if (usernameInput) usernameInput.value = praviKorisnik.username || "";
    if (emailInput) emailInput.value = praviKorisnik.email || "";
    if (telefonInput) telefonInput.value = praviKorisnik.telefon || "";
    if (gradInput) gradInput.value = praviKorisnik.grad || "";
    if (adresaInput) adresaInput.value = praviKorisnik.adresa || "";

    forma.addEventListener("submit", function (e) {
        e.preventDefault();

        praviKorisnik.ime = imeInput ? imeInput.value.trim() : praviKorisnik.ime;
        praviKorisnik.prezime = prezimeInput ? prezimeInput.value.trim() : praviKorisnik.prezime;
        praviKorisnik.username = usernameInput ? usernameInput.value.trim() : praviKorisnik.username;
        praviKorisnik.email = emailInput ? emailInput.value.trim() : praviKorisnik.email;
        praviKorisnik.telefon = telefonInput ? telefonInput.value.trim() : praviKorisnik.telefon;
        praviKorisnik.grad = gradInput ? gradInput.value.trim() : praviKorisnik.grad;
        praviKorisnik.adresa = adresaInput ? adresaInput.value.trim() : praviKorisnik.adresa;

        sacuvajKorisnike(sviKorisnici);

        sacuvajUlogovanogKorisnika({
            id: praviKorisnik.id,
            username: praviKorisnik.username,
            ime: praviKorisnik.ime,
            prezime: praviKorisnik.prezime,
            email: praviKorisnik.email,
            telefon: praviKorisnik.telefon,
            grad: praviKorisnik.grad,
            adresa: praviKorisnik.adresa,
            uloga: praviKorisnik.uloga
        });

        alert("Izmene su sačuvane.");
    });
}


// ======================================================
// PROFIL MAJSTORA
// ======================================================

function inicijalizujProfilMajstora(params, majstori) {
    const imeEl = document.getElementById("imeMajstora");
    const kategorijaEl = document.getElementById("kategorijaMajstora");
    const lokacijaEl = document.getElementById("lokacijaMajstora");
    const opisEl = document.getElementById("opisMajstora");

    if (!imeEl || !kategorijaEl || !lokacijaEl) return;

    const majstorId = params.get("id");
    if (!majstorId) return;

    const majstor = majstori.find(m => String(m.id) === String(majstorId));

    if (!majstor) {
        alert("Majstor nije pronađen.");
        return;
    }

    imeEl.textContent = majstor.ime;
    kategorijaEl.textContent = majstor.kategorija;
    lokacijaEl.textContent = majstor.lokacija;

    if (opisEl) {
        opisEl.textContent = majstor.opis || "";
    }

    const zakaziLink = document.getElementById("zakaziMajstoraLink");
    if (zakaziLink) {
        zakaziLink.href = `kreiranjeZahteva.html?majstorId=${majstor.id}`;
    }
    prikaziOceneMajstora(majstor.id);
}


// ======================================================
// KREIRANJE ZAHTEVA
// ======================================================

function inicijalizujFormuZaKreiranje(params, majstori, korisnik) {
    const forma = document.getElementById("kreiranjeZahtevaForma");
    if (!forma) return;

    const majstorId = params.get("majstorId") || "101";
    const majstor = majstori.find(m => String(m.id) === String(majstorId));

    const majstorIdInput = document.getElementById("majstorId");
    const majstorImeInput = document.getElementById("majstorIme");
    const kategorijaInput = document.getElementById("kategorija");
    const lokacijaInput = document.getElementById("lokacija");

    if (majstor) {
        if (majstorIdInput) majstorIdInput.value = majstor.id;
        if (majstorImeInput) majstorImeInput.value = majstor.ime;
        if (kategorijaInput) kategorijaInput.value = majstor.kategorija;
        if (lokacijaInput && !lokacijaInput.value) lokacijaInput.value = majstor.lokacija;
    }

    forma.addEventListener("submit", function (e) {
        e.preventDefault();

        const naslovInput = document.getElementById("naslovZahteva");
        const adresaInput = document.getElementById("adresa");
        const opisInput = document.getElementById("opisProblema");
        const dodatnaNapomenaInput = document.getElementById("dodatnaNapomena");

        const naslov = naslovInput ? naslovInput.value.trim() : "";
        const adresa = adresaInput ? adresaInput.value.trim() : "";
        const lokacija = lokacijaInput ? lokacijaInput.value.trim() : "";
        const opis = opisInput ? opisInput.value.trim() : "";
        const dodatnaNapomena = dodatnaNapomenaInput ? dodatnaNapomenaInput.value.trim() : "";

        if (naslov === "" || opis === "" || adresa === "") {
            alert("Morate uneti naslov zahteva, adresu i opis problema.");
            return;
        }

        const zahtevi = preuzmiZahteve();

        const noviZahtev = {
            id: Date.now().toString(),
            naslov: naslov,
            majstorId: majstor ? majstor.id : majstorId,
            majstor: majstor ? majstor.ime : "Nepoznat majstor",
            lokacija: lokacija || (majstor ? majstor.lokacija : ""),
            adresa: adresa,
            opis: dodatnaNapomena ? `${opis}\n\nNapomena: ${dodatnaNapomena}` : opis,
            status: "Na čekanju",
            korisnikId: korisnik ? korisnik.id : null
        };

        zahtevi.unshift(noviZahtev);
        sacuvajZahteve(zahtevi);

        window.location.href = "zahtevi.html";
    });
}


// ======================================================
// PRIKAZ LISTE ZAHTEVA
// ======================================================

function prikaziSveZahteve() {
    const requestList = document.getElementById("requestList");
    if (!requestList) return;

    const korisnik = preuzmiUlogovanogKorisnika();
    const zahtevi = preuzmiZahteve();

    const filtriraniZahtevi = korisnik
        ? zahtevi.filter(z => String(z.korisnikId) === String(korisnik.id))
        : [];

    requestList.innerHTML = "";

    if (filtriraniZahtevi.length === 0) {
        requestList.innerHTML = `
            <div class="col-12">
                <div class="card p-3">
                    <h5>Nema zahteva</h5>
                    <p class="mb-0">Još uvek nemate kreiran nijedan zahtev.</p>
                </div>
            </div>
        `;
        return;
    }

    filtriraniZahtevi.forEach(zahtev => {
        const col = document.createElement("div");
        col.className = "col-md-6";

        col.innerHTML = `
            <a href="zakazivanje.html?id=${zahtev.id}" class="card-link text-decoration-none">
                <div class="card p-3">
                    <h5>${zahtev.naslov}</h5>
                    <p class="mb-1">Majstor: ${zahtev.majstor}</p>
                    <span class="badge ${vratiStatusKlasu(zahtev.status)} status">${zahtev.status}</span>
                </div>
            </a>
        `;

        requestList.appendChild(col);
    });
}

function vratiStatusKlasu(status) {
    if (status === "Na čekanju") return "bg-warning text-dark";
    if (status === "Prihvaćen") return "bg-success";
    if (status === "Završen") return "bg-primary";
    if (status === "Odbijen") return "bg-danger";
    return "bg-secondary";
}


// ======================================================
// DETALJ ZAHTEVA
// ======================================================

function prikaziDetaljZahteva(params) {
    if (!document.getElementById("zahtevId")) return;

    const id = params.get("id");
    const zahtevi = preuzmiZahteve();
    const zahtev = zahtevi.find(z => z.id == id) || zahtevi[0];

    if (!zahtev) return;

    const zahtevId = document.getElementById("zahtevId");
    const zahtevNaslov = document.getElementById("zahtevNaslov");
    const majstorIme = document.getElementById("majstorIme");
    const lokacija = document.getElementById("lokacija");
    const opisZahteva = document.getElementById("opisZahteva");
    const statusBadge = document.getElementById("statusBadge");

    if (zahtevId) zahtevId.textContent = zahtev.id;
    if (zahtevNaslov) zahtevNaslov.textContent = zahtev.naslov;
    if (majstorIme) majstorIme.textContent = zahtev.majstor;
    if (lokacija) lokacija.textContent = zahtev.lokacija || "-";
    if (opisZahteva) opisZahteva.textContent = zahtev.opis;

    if (statusBadge) {
        statusBadge.textContent = zahtev.status;

        if (zahtev.status === "Na čekanju") {
            statusBadge.className = "badge bg-warning text-dark status-badge";
        } else if (zahtev.status === "Prihvaćen") {
            statusBadge.className = "badge bg-success status-badge";
        } else if (zahtev.status === "Završen") {
            statusBadge.className = "badge bg-primary status-badge";

            const reviewSekcija = document.getElementById("reviewSekcija");
            if (reviewSekcija) reviewSekcija.classList.remove("hidden");
        } else if (zahtev.status === "Odbijen") {
            statusBadge.className = "badge bg-danger status-badge";
        }
    }

    const dugmeZakazi = document.getElementById("zakaziBtn");
    if (dugmeZakazi && zahtev.status !== "Prihvaćen") {
        dugmeZakazi.disabled = true;
        dugmeZakazi.title = "Samo prihvaćen zahtev može da se zakaže";
    }
}


// ======================================================
// CHAT
// ======================================================

function posaljiPoruku() {
    const input = document.getElementById("chatInput");
    const chatBox = document.getElementById("chatBox");

    if (!input || !chatBox || input.value.trim() === "") return;

    const novaPoruka = document.createElement("div");
    novaPoruka.classList.add("message", "user");
    novaPoruka.textContent = input.value;

    chatBox.appendChild(novaPoruka);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}


// ======================================================
// ZAKAZIVANJE
// ======================================================

function toggleTermin() {
    const sekcija = document.getElementById("terminSekcija");
    if (sekcija) sekcija.classList.toggle("hidden");
}

function zakaziTermin() {
    const termin = document.getElementById("terminSelect");
    const poruka = document.getElementById("terminPoruka");

    if (!termin || !poruka) return;

    if (termin.value === "") {
        poruka.textContent = "Morate izabrati termin.";
        poruka.className = "text-warning";
        return;
    }

    poruka.textContent = "Termin zakazan!";
    poruka.className = "text-success";
}


// ======================================================
// PRIJAVA PROBLEMA
// ======================================================

function toggleProblem() {
    const sekcija = document.getElementById("problemSekcija");
    if (sekcija) sekcija.classList.toggle("hidden");
}

function posaljiPrijavu() {
    const tekst = document.getElementById("problemText");
    const poruka = document.getElementById("problemPoruka");

    if (!tekst || !poruka || tekst.value.trim() === "") {
        poruka.textContent = "Unesite opis problema.";
        poruka.className = "text-warning";
        return;
    }

    poruka.textContent = "Prijava poslata.";
    poruka.className = "text-success";
    tekst.value = "";
}

function posaljiOcenu() {
    const ocenaSelect = document.getElementById("ocenaSelect");
    const reviewPoruka = document.getElementById("reviewPoruka");

    if (!ocenaSelect || !reviewPoruka) return;

    if (ocenaSelect.value === "") {
        reviewPoruka.textContent = "Morate izabrati ocenu.";
        reviewPoruka.className = "mt-3 mb-0 text-warning";
        return;
    }

    reviewPoruka.textContent = "Ocena uspešno sačuvana.";
    reviewPoruka.className = "mt-3 mb-0 text-success";
}

function posaljiKomentar() {
    const komentarText = document.getElementById("komentarText");
    const reviewPoruka = document.getElementById("reviewPoruka");

    if (!komentarText || !reviewPoruka) return;

    if (komentarText.value.trim() === "") {
        reviewPoruka.textContent = "Morate uneti komentar.";
        reviewPoruka.className = "mt-3 mb-0 text-warning";
        return;
    }

    reviewPoruka.textContent = "Komentar uspešno sačuvan.";
    reviewPoruka.className = "mt-3 mb-0 text-success";
}

// function inicijalizujProfilMajstora(params, majstori) {
//     const imeEl = document.getElementById("imeMajstora");
//     const kategorijaEl = document.getElementById("kategorijaMajstora");
//     const lokacijaEl = document.getElementById("lokacijaMajstora");
//     const opisEl = document.getElementById("opisMajstora");
//     const kategorijaInfoEl = document.getElementById("kategorijaMajstoraInfo");
//     const lokacijaInfoEl = document.getElementById("lokacijaMajstoraInfo");

//     if (!imeEl || !kategorijaEl || !lokacijaEl) return;

//     const majstorId = params.get("id");
//     if (!majstorId) return;

//     const majstor = majstori.find(m => String(m.id) === String(majstorId));

//     if (!majstor) {
//         alert("Majstor nije pronađen.");
//         return;
//     }

//     imeEl.textContent = majstor.ime;
//     kategorijaEl.textContent = majstor.kategorija;
//     lokacijaEl.textContent = majstor.lokacija;

//     if (opisEl) opisEl.textContent = majstor.opis || "";
//     if (kategorijaInfoEl) kategorijaInfoEl.textContent = majstor.kategorija;
//     if (lokacijaInfoEl) lokacijaInfoEl.textContent = majstor.lokacija;

//     const zakaziLink = document.getElementById("zakaziMajstoraLink");
//     if (zakaziLink) {
//         zakaziLink.href = `kreiranjeZahteva.html?majstorId=${majstor.id}`;
//     }
// }

function prikaziMajstore() {
    const container = document.getElementById("servicesList");
    if (!container) return;

    const filterKategorija = document.getElementById("filterKategorija");
    const sortOcena = document.getElementById("sortOcena");

    let majstori = preuzmiMajstore();

    const izabranaKategorija = filterKategorija ? filterKategorija.value : "sve";
    const nacinSortiranja = sortOcena ? sortOcena.value : "default";

    if (izabranaKategorija !== "sve") {
        majstori = majstori.filter(m => m.kategorija === izabranaKategorija);
    }

    if (nacinSortiranja === "asc") {
        majstori.sort((a, b) => (a.ocena || 0) - (b.ocena || 0));
    } else if (nacinSortiranja === "desc") {
        majstori.sort((a, b) => (b.ocena || 0) - (a.ocena || 0));
    }

    container.innerHTML = "";

    if (majstori.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card p-3">
                    <h5>Nema rezultata</h5>
                    <p class="mb-0">Za izabrane filtere nema dostupnih majstora.</p>
                </div>
            </div>
        `;
        return;
    }

    majstori.forEach(majstor => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        col.innerHTML = `
            <a href="profilMajstora.html?id=${majstor.id}" class="text-decoration-none" style="color: white;">
                <div class="service-card">
                    <h5>${majstor.opis ? majstor.opis.split(".")[0] : majstor.kategorija}</h5>
                    <p class="mb-1"><strong>Majstor:</strong> ${majstor.ime}</p>
                    <p class="mb-1 text-light"><strong>Kategorija:</strong> ${majstor.kategorija}</p>
                    <p class="text-light mb-0"><strong>Ocena:</strong> ${majstor.ocena ?? "-"}</p>
                </div>
            </a>
        `;

        container.appendChild(col);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    inicijalizujPodatke();

    const korisnik = preuzmiUlogovanogKorisnika();
    prikaziImeKorisnika(korisnik);
    inicijalizujNotifikacije();

    const params = new URLSearchParams(window.location.search);
    const majstori = preuzmiMajstore();

    inicijalizujRegistraciju();
    inicijalizujLogin();
    inicijalizujLogout();
    inicijalizujProfilKorisnika();
    inicijalizujProfilMajstora(params, majstori);
    inicijalizujFormuZaKreiranje(params, majstori, korisnik);

    prikaziSveZahteve();
    prikaziDetaljZahteva(params);

    prikaziMajstore();

    const filterKategorija = document.getElementById("filterKategorija");
    const sortOcena = document.getElementById("sortOcena");

    if (filterKategorija) {
        filterKategorija.addEventListener("change", prikaziMajstore);
    }

    if (sortOcena) {
        sortOcena.addEventListener("change", prikaziMajstore);
    }
});

function prikaziOceneMajstora(majstorId) {
    const brojEl = document.getElementById("brojOcena");
    const prosekEl = document.getElementById("prosecnaOcena");

    if (!brojEl || !prosekEl) return;

    const ocene = JSON.parse(localStorage.getItem("ocene")) || [];

    const oceneMajstora = ocene.filter(o => o.majstorId === majstorId);

    const broj = oceneMajstora.length;

    if (broj === 0) {
        brojEl.textContent = "0";
        prosekEl.textContent = "-";
        return;
    }

    const suma = oceneMajstora.reduce((sum, o) => sum + o.vrednost, 0);
    const prosek = (suma / broj).toFixed(1);

    brojEl.textContent = broj;
    prosekEl.textContent = prosek;
}