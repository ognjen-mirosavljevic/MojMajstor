// Ognjen Mirosavljevic
document.addEventListener("DOMContentLoaded", function () {
    // KORISNIK (LOGIN SIMULACIJA)
    if (!localStorage.getItem("ulogovaniKorisnik")) {
        localStorage.setItem("ulogovaniKorisnik", JSON.stringify({
            id: 1,
            ime: "Ognjen",
            uloga: "korisnik"
        }));
    }

    const korisnik = JSON.parse(localStorage.getItem("ulogovaniKorisnik"));
    const userNameSpan = document.getElementById("userName");

    if (korisnik && userNameSpan) {
        userNameSpan.textContent = korisnik.ime;
    }
    // NOTIFIKACIJE
    const badge = document.getElementById("notifCount");
    let brojNotifikacija = 3;

    if (badge) {
        if (brojNotifikacija > 0) {
            badge.textContent = brojNotifikacija;
        } else {
            badge.style.display = "none";
        }
    }
    // MAJSTORI (FAKE BAZA)
    const majstori = {
        "101": {
            id: "101",
            ime: "Marko Petrović",
            kategorija: "Vodoinstalater",
            lokacija: "Voždovac"
        },
        "102": {
            id: "102",
            ime: "Nikola Jovanović",
            kategorija: "Električar",
            lokacija: "Zvezdara"
        },
        "103": {
            id: "103",
            ime: "Milan Ilić",
            kategorija: "Serviser bojlera",
            lokacija: "Novi Beograd"
        },
        "104": {
            id: "104",
            ime: "Petar Nikolić",
            kategorija: "Moler",
            lokacija: "Palilula"
        }
    };
    // POČETNI ZAHTEVI
    const pocetniZahtevi = [
        {
            id: "101",
            naslov: "Popravka slavine",
            majstorId: "101",
            majstor: "Marko Petrović",
            lokacija: "Voždovac",
            adresa: "Bulevar oslobođenja 12",
            opis: "Slavina curi...",
            status: "Na čekanju",
            korisnikId: 1
        },
        {
            id: "102",
            naslov: "Električne instalacije",
            majstorId: "102",
            majstor: "Nikola Jovanović",
            lokacija: "Zvezdara",
            adresa: "Mite Ružića 4",
            opis: "Popravka utičnice",
            status: "Prihvaćen",
            korisnikId: 1
        },
        {
            id: "103",
            naslov: "Popravka bojlera",
            majstorId: "103",
            majstor: "Milan Ilić",
            lokacija: "Novi Beograd",
            adresa: "Jurija Gagarina 55",
            opis: "Bojler ne radi",
            status: "Završen",
            korisnikId: 1
        },
        {
            id: "104",
            naslov: "Krečenje stana",
            majstorId: "104",
            majstor: "Petar Nikolić",
            lokacija: "Palilula",
            adresa: "Višnjička 21",
            opis: "Krečenje sobe",
            status: "Odbijen",
            korisnikId: 1
        }
    ];

    if (!localStorage.getItem("zahtevi")) {
        localStorage.setItem("zahtevi", JSON.stringify(pocetniZahtevi));
    }
    // URL PARAMETRI
    const params = new URLSearchParams(window.location.search);
    // KREIRANJE ZAHTEVA STRANICA
    inicijalizujFormuZaKreiranje(params, majstori, korisnik);
    // LISTA ZAHTEVA STRANICA
    prikaziSveZahteve();
    // DETALJ ZAHTEVA STRANICA
    prikaziDetaljZahteva(params);
});


// POMOĆNE FUNKCIJE ZA localStorage
function preuzmiZahteve() {
    return JSON.parse(localStorage.getItem("zahtevi")) || [];
}

function sacuvajZahteve(zahtevi) {
    localStorage.setItem("zahtevi", JSON.stringify(zahtevi));
}

// KREIRANJE ZAHTEVA
function inicijalizujFormuZaKreiranje(params, majstori, korisnik) {
    const forma = document.getElementById("kreiranjeZahtevaForma");
    if (!forma) return;

    const majstorId = params.get("majstorId") || "101";
    const majstor = majstori[majstorId];

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

// PRIKAZ LISTE ZAHTEVA
function prikaziSveZahteve() {
    const requestList = document.getElementById("requestList");
    if (!requestList) return;

    const zahtevi = preuzmiZahteve();
    requestList.innerHTML = "";

    if (zahtevi.length === 0) {
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

    zahtevi.forEach(zahtev => {
        const col = document.createElement("div");
        col.className = "col-md-6";

        col.innerHTML = `
            <a href="zakazivanje.html?id=${zahtev.id}" class="card-link">
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


// DETALJ ZAHTEVA
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

// CHAT
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

// ZAKAZIVANJE
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


// PRIJAVA PROBLEMA
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