const params = new URLSearchParams(window.location.search);
        const id = params.get("id") || "101";

        const zahtevi = {
            "101": {
                id: "101",
                naslov: "Popravka slavine",
                majstor: "Marko Petrović",
                lokacija: "Voždovac",
                opis: "Slavina u kuhinji curi već nekoliko dana i potrebno je zameniti dihtung ili ceo mehanizam.",
                status: "Na čekanju"
            },
            "102": {
                id: "102",
                naslov: "Električne instalacije",
                majstor: "Nikola Jovanović",
                lokacija: "Zvezdara",
                opis: "Potrebna provera i popravka utičnice u dnevnoj sobi.",
                status: "Prihvaćen"
            },
            "103": {
                id: "103",
                naslov: "Popravka bojlera",
                majstor: "Milan Ilić",
                lokacija: "Novi Beograd",
                opis: "Bojler ne zagreva vodu dovoljno i čuje se čudan zvuk pri radu.",
                status: "Završen"
            },
            "104": {
                id: "104",
                naslov: "Krečenje stana",
                majstor: "Petar Nikolić",
                lokacija: "Palilula",
                opis: "Potrebno krečenje jedne sobe i hodnika.",
                status: "Odbijen"
            }
        };

        const zahtev = zahtevi[id] || zahtevi["101"];

        document.getElementById("zahtevId").textContent = zahtev.id;
        document.getElementById("zahtevNaslov").textContent = zahtev.naslov;
        document.getElementById("majstorIme").textContent = zahtev.majstor;
        document.getElementById("lokacija").textContent = zahtev.lokacija;
        document.getElementById("opisZahteva").textContent = zahtev.opis;

        const statusBadge = document.getElementById("statusBadge");
        statusBadge.textContent = zahtev.status;

        if (zahtev.status === "Na čekanju") {
            statusBadge.className = "badge bg-warning text-dark status-badge";
        } else if (zahtev.status === "Prihvaćen") {
            statusBadge.className = "badge bg-success status-badge";
        } else if (zahtev.status === "Završen") {
            statusBadge.className = "badge bg-primary status-badge";
            document.getElementById("reviewSekcija").classList.remove("hidden");
        } else if (zahtev.status === "Odbijen") {
            statusBadge.className = "badge bg-danger status-badge";
        }

        function posaljiPoruku() {
            const input = document.getElementById("chatInput");
            const chatBox = document.getElementById("chatBox");

            if (input.value.trim() === "") return;

            const novaPoruka = document.createElement("div");
            novaPoruka.classList.add("message", "user");
            novaPoruka.textContent = input.value;
            chatBox.appendChild(novaPoruka);

            input.value = "";
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function toggleTermin() {
            if (zahtev.status !== "Prihvaćen") {
                alert("Termin možeš zakazati tek kada majstor prihvati zahtev.");
                return;
            }

            document.getElementById("terminSekcija").classList.toggle("hidden");
        }

        const dugmeZakazi = document.getElementById("zakaziBtn");

            if (zahtev.status !== "Prihvaćen") {
                dugmeZakazi.disabled = true;
                dugmeZakazi.title = "Zakazivanje moguće samo za prihvaćen zahtev";
            }

        function zakaziTermin() {
            const termin = document.getElementById("terminSelect").value;
            const poruka = document.getElementById("terminPoruka");

            if (termin === "") {
                poruka.textContent = "Morate izabrati termin.";
                poruka.className = "mt-3 mb-0 text-warning";
                return;
            }

            poruka.textContent = "Termin je uspešno zakazan: " + termin;
            poruka.className = "mt-3 mb-0 text-success";
        }

        function toggleProblem() {
            document.getElementById("problemSekcija").classList.toggle("hidden");
        }

        function posaljiPrijavu() {
            const tekst = document.getElementById("problemText").value.trim();
            const poruka = document.getElementById("problemPoruka");

            if (tekst === "") {
                poruka.textContent = "Unesite opis problema.";
                poruka.className = "mt-3 mb-0 text-warning";
                return;
            }

            poruka.textContent = "Prijava problema je uspešno poslata administratoru.";
            poruka.className = "mt-3 mb-0 text-success";
            document.getElementById("problemText").value = "";
        }

        function posaljiOcenu() {
            const ocena = document.getElementById("ocenaSelect").value;
            const poruka = document.getElementById("reviewPoruka");

            if (ocena === "") {
                poruka.textContent = "Izaberite ocenu.";
                poruka.className = "mt-3 mb-0 text-warning";
                return;
            }

            poruka.textContent = "Ocena je uspešno sačuvana.";
            poruka.className = "mt-3 mb-0 text-success";
        }

        function posaljiKomentar() {
            const komentar = document.getElementById("komentarText").value.trim();
            const poruka = document.getElementById("reviewPoruka");

            if (komentar === "") {
                poruka.textContent = "Unesite komentar.";
                poruka.className = "mt-3 mb-0 text-warning";
                return;
            }

            poruka.textContent = "Komentar je uspešno sačuvan.";
            poruka.className = "mt-3 mb-0 text-success";
            document.getElementById("komentarText").value = "";
        }

        let brojNotifikacija = 3;

        const badge = document.getElementById("notifCount");

        if (brojNotifikacija > 0) {
            badge.textContent = brojNotifikacija;
        } else {
            badge.style.display = "none";
        }