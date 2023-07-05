class PageController {
    constructor() {
        window.addEventListener("hashchange", this.handelHashChange);
        window.addEventListener("load", this.handelHashChange);
        this.manager = new AnimalManager();
        this.renderHeader();
    }

    handelHashChange = () => {
        let hash = window.location.hash.slice(1) || "login";

        if (hash === 'home' || hash === 'adopted' || hash === 'donates') {
            if (!userManager.loggedUser) {
                location.hash = 'login';
                return;
            } 
        }

        const pageIds = ["home", "adopted", "donates", "register", "login"];

        pageIds.forEach(id => {
            let page = document.getElementById(id);
            if (hash === id) {
                page.style.display = "block";
            } else {
                page.style.display = "none";
            }
        });

        switch (hash) {
            case 'login':
                this.renderLogin();
                break;
            case 'register':
                this.checkingRegister();
                break;
            case "home":
                this.selectSearch();
                this.search();
                this.showAvailableAnimalsSection('container', this.manager.all());
                break;
            case "adopted":
                this.showAdoptedAnimalsSection('adopted', this.manager.allAdopted());
                break;
            case "donates":
                this.checkingBtn();
                this.renderTable();
                break;
        }

        this.renderHeader();
    }

    renderHeader = () => {
        let loginButton = document.querySelector("nav .login");
        let registerButton = document.querySelector("nav .register");
        let logoutButton = document.querySelector("nav .logout.hidden");
    
        if (userManager.loggedUser) {
        loginButton.style.display = "none";
        registerButton.style.display = "none";
        logoutButton.style.display = "block";
          logoutButton.onclick = () => {
            userManager.logout();
            this.renderHeader();
          };
        } else {
        loginButton.style.display = "block";
        registerButton.style.display = "block";
        logoutButton.style.display = "none";
        }
    };
    

    showAvailableAnimalsSection = (containerID, animals) => {
        let container = document.getElementById(containerID);
        if (animals.length === 0) {
            return;
        }

        container.innerHTML = "";

        animals.forEach((animal) => {
            if (this.manager.existsInAdopted(animal)) {
                return;
            }

            let card = document.createElement("div");
            card.dataset.animal = `${animal.name}`
            card.classList.add("card");
            card.style.margin = "10px";
            card.style.boxShadow = "20px 21px 80px -10px rgb(0 0 0 / 85%)";

            let imgDiv = document.createElement("div");
            imgDiv.classList.add("div-img");
            let img = document.createElement("img");
            img.src = animal.image;
            img.classList.add("img");
            img.width = 200;
            imgDiv.appendChild(img);

            let name = document.createElement("div");
            name.classList.add("name")
            name.innerText = `Име: ${animal.name}`;

            let type = document.createElement("div");
            type.classList.add("type");
            type.innerText = `Тип: ${animal.type}`;

            let bread = document.createElement("div");
            bread.classList.add("bread");
            bread.innerText = `Порода: ${animal.bread}`;

            let age = document.createElement("div");
            age.classList.add("age")
            age.innerText = `Години: ${animal.age}`;

            let adoptBtn = document.createElement("button");
            adoptBtn.classList.add("adopted-cards");
            adoptBtn.innerText = "Adopt";
            adoptBtn.addEventListener("click", () => {
                this.manager.adopt(animal.name);
                card.remove(); 
                this.manager.removeFromLocalStorage(animal.name);
            });

            let neededAmountDonation = document.createElement("div");
            neededAmountDonation.classList.add("needed-amount");
            neededAmountDonation.innerText = `Необходима сума: ${animal.neededAmount}`;

            let donateBtn = document.createElement("button");
            donateBtn.classList.add("donated-sum");
            donateBtn.id = "dotane-btn";
            donateBtn.innerText = "Donate";
            donateBtn.value = animal.name;
            donateBtn.addEventListener("click", () => {
                window.location.hash = "donates";
                let heading = document.querySelector(".page #heading");
                heading.innerText = `How much money do you want to donate to ${animal.name}`;
                this.manager.donate(animal.name);
                this.manager.findAnimal(animal.name);
            });

            let existsInFavorite = this.manager.existsInAdopted(animal);
            if (existsInFavorite || animal.neededAmount === animal.currentlyRisedAmount) {
                if (donateBtn.parentElement) {
                    donateBtn.parentElement.removeChild(donateBtn);
                }
            }

            card.append(
                imgDiv,
                name,
                type,
                bread,
                age,
                neededAmountDonation,
                adoptBtn,
                donateBtn
            );

            container.appendChild(card);
        });
    }



    showAdoptedAnimalsSection = (containerID, animals) => {
        console.log(animals)
        let container = document.getElementById(containerID);
        if (animals.length === 0) {
            container.innerHTML = "";
            return;
        }

        container.innerHTML = "";

        animals.forEach((animal) => {
            let card = document.createElement("div");
            card.dataset.animal = `${animal.name}`
            card.classList.add("card");
            card.style.margin = "10px";
            card.style.boxShadow = "20px 21px 80px -10px rgb(0 0 0 / 85%)";

            let imgDiv = document.createElement("div");
            imgDiv.classList.add("div-img");
            let img = document.createElement("img");
            img.src = animal.image;
            img.classList.add("img");
            img.width = 200;
            imgDiv.appendChild(img);

            let name = document.createElement("div");
            name.classList.add("name")
            name.innerText = `Име: ${animal.name}`;

            let type = document.createElement("div");
            type.classList.add("type");
            type.innerText = `Тип: ${animal.type}`;

            let bread = document.createElement("div");
            bread.classList.add("bread");
            bread.innerText = `Порода: ${animal.bread}`;

            let age = document.createElement("div");
            age.classList.add("age")
            age.innerText = `Години: ${animal.age}`;

            let adoptBtn = document.createElement("button");
            adoptBtn.classList.add("adopted-cards");
            adoptBtn.innerText = "Leave";
            adoptBtn.addEventListener("click", () => {
                this.manager.removeFromAdopted(animal.name);
                this.showAdoptedAnimalsSection('adopted', this.manager.allAdopted()); // Update the displayed list
            });

            let timeOfAdoption = new Date().toLocaleDateString();

            card.append(
                imgDiv,
                name,
                type,
                bread,
                age,
                timeOfAdoption,
                adoptBtn
            );

            container.appendChild(card);
        });
    }

    checkingBtn = () => {
        let input1 = document.querySelector(".form-group #name");
        let input2 = document.querySelector(".form-group #sum");
        let button = document.querySelector(".form-group #btn-create");


        button.disabled = true;

        const checkInputs = () => {
            if (input1.value.trim() !== "" && input2.value.trim() !== "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        };

        input1.onkeyup = checkInputs;
        input2.onkeyup = checkInputs;

    };


    searchByName = (keyword) => {
        const match = this.manager.applySearch(keyword);
        this.showAvailableAnimalsSection('container', match);
    }

    search = () => {
        let search = document.getElementById("search-input");
        search.placeholder = 'Търси по име';
        search.addEventListener('keyup', () => this.searchByName(search.value));
    }


    selectSearch = () => {
        const types = [...new Set(data.map(animal => animal.type))];

        const select = document.getElementById("animal-type-select");
        select.innerHTML = "";

        types.forEach((type) => {
            let option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            document.getElementById("animal-type-select").appendChild(option);
        });

        select.addEventListener("change", (event) => {
            this.showAvailableAnimalsSection("container", this.manager.filterByType(event.target.value));
        });
    }

    renderTable = () => {
        let form = document.querySelector("#donation-form");
    
        let table = document.querySelector("#history-table");
        let tbody = table.querySelector("tbody");
    
        let donationAdded = false; 

        let user = JSON.parse(localStorage.getItem("isThereUser"));
      
        if (user && user.donates) {
          // Retrieve the donations array from the user
          let donations = user.donates;
          tbody.innerHTML = "";
        
          // Iterate over the donations and display them on the donation page
          donations.forEach((donation) => {
            let tr = document.createElement("tr");
      
            let trOne = document.createElement("td");
            trOne.innerText = donation.date;
      
            let trTwo = document.createElement("td");
            trTwo.innerText = donation.animalName;
      
            let trThree = document.createElement("td");
            trThree.innerText = donation.donatedSum;
      
            tr.append(trOne, trTwo, trThree);
            tbody.appendChild(tr);
          });
        }
    
        form.onsubmit = (event) => {
            // event.stopPropagation();
            event.preventDefault();
    
            if (donationAdded) {
                return; // Exit if donation has already been added
            }
    
            let tr = document.createElement("tr");
    
            let trOne = document.createElement("td");
            trOne.innerText = new Date().toLocaleDateString();
    
            let trTwo = document.createElement("td");
            trTwo.innerText = this.manager.foundAnimal.name;
    
            let trThree = document.createElement("td");
            let donationAmount = document.getElementById("sum").value;
            this.manager.foundAnimal.sum = this.manager.neededAmount(this.manager.foundAnimal, donationAmount);
            trThree.innerText = this.manager.foundAnimal.sum;
    
            tr.append(trOne, trTwo, trThree);
            tbody.appendChild(tr);
    
            // Store donation in local storage
            let donation = {
                date: trOne.innerText,
                animalName: trTwo.innerText,
                donatedSum: trThree.innerText
            };
            user.donates.push(donation);
            localStorage.setItem("isThereUser", JSON.stringify(user));
    
            donationAdded = true; // Set donationAdded flag to true
            form.reset();
        };
    };
    
    renderLogin = () => {

        let input1 = document.querySelector("#login #name");
        let input2 = document.querySelector("#login #loginPass");
        let button = document.querySelector("#login #buttonCreate");


        const checkInputs = () => {
            if (
                input1.value.trim() !== "" &&
                input2.value.trim() !== ""
            ) {
                button.removeAttribute("disabled");
            } else {
                button.setAttribute("disabled", "disabled");
            }
        };

        const preventSpaces = (event) => {
            if (event.keyCode === 32) {
                event.preventDefault();
            }
        };

        checkInputs();
        input1.addEventListener("keyup", checkInputs);
        input2.addEventListener("keyup", checkInputs);

        input1.addEventListener("keydown", preventSpaces);
        input2.addEventListener("keydown", preventSpaces);

        let form = document.getElementById('loginForm');

        form.onsubmit = (e) => {
            e.preventDefault();
            checkInputs();
            let username = e.target.elements.username.value.trim();
            let pass = e.target.elements.pass.value.trim();

            let successfulLogin = userManager.login({ username, pass });
            if (successfulLogin) {
                alert("You have logged succefully");
                location.hash = "home";
            } else {
                alert("Invalid username or password. Please try again.");
            }
            form.reset();
        }
    }


    checkingRegister = () => {
        let form = document.getElementById("registerForm");
        let input1 = document.getElementById("registerName");
        let input2 = document.getElementById("registerPass");
        let input3 = document.getElementById("registerConfirm");
        let button = document.getElementById("registerSumbit");

        const checkInputs = () => {
            if (
                input1.value.trim() !== "" &&
                input2.value.trim() !== "" &&
                input3.value.trim() !== "" &&
                !input1.value.includes(" ") &&
                !input2.value.includes(" ") &&
                !input3.value.includes(" ")
            ) {
                button.removeAttribute("disabled");
            } else {
                button.setAttribute("disabled", "disabled");
            }
        };

        const preventSpaces = (event) => {
            if (event.keyCode === 32) {
                event.preventDefault();
            }
        };

        checkInputs();
        input1.addEventListener("keyup", () => {
            checkInputs();
        });
        input2.addEventListener("keyup", () => {
            checkInputs();
        });
        input3.addEventListener("keyup", () => {
            checkInputs();
        });

        input1.addEventListener("keydown", preventSpaces);
        input2.addEventListener("keydown", preventSpaces);
        input3.addEventListener("keydown", preventSpaces);

        const verifyPassword = () => {
            let isNameTaken = userManager.IsNameTaken(input1.value);
            if (isNameTaken) {
                alert("This username is taken");
                return null;
            }

            const specialChars = "!@#$%^&*(),.?\":{}|<>";

            let hasSpecialChar = false;
            let hasUppercaseChar = false;
            let hasLowercaseChar = false;

            for (let i = 0; i < input2.value.length; i++) {
                const char = input2.value.charAt(i);

                if (specialChars.includes(char)) {
                    hasSpecialChar = true;
                } else if (char === char.toUpperCase()) {
                    hasUppercaseChar = true;
                } else if (char === char.toLowerCase()) {
                    hasLowercaseChar = true;
                }
            }

            const isLongEnough = input2.value.length >= 6;

            if (input2.value !== input3.value) {
                alert("Wrong password, please re-enter it.");
                form.reset();
                return false;
            }

            if (!hasSpecialChar || !hasUppercaseChar || !hasLowercaseChar || !isLongEnough) {
                alert("Invalid password. It must contain at least one uppercase letter, one number, one special symbol, and must not have spaces.");
                form.reset();
                return false;
            }

            return true;
        };

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            let username = input1.value;
            let pass = input2.value;
            checkInputs();
            if (verifyPassword()) {
                userManager.register({ username, pass });
                location.hash = "login";
            }
        });
    }

}

const controller = new PageController();