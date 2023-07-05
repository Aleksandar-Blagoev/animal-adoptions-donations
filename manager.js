class Donation {
    constructor(name, sum) {
        this.name = name;
        this.sum = null;
    }
}

class Animal {
    constructor(name, image, type, bread, age, sex, neededAmount, currentlyRisedAmount) {
        this.name = name;
        this.image = image;
        this.type = type;
        this.bread = bread;
        this.age = age;
        this.sex = sex;
        this.neededAmount = neededAmount;
        this.currentlyRisedAmount = currentlyRisedAmount;
    }
}


class AnimalManager {
    constructor() {
        this.index = null;
        this.adopted = JSON.parse(localStorage.getItem('adopted')) || [];
        this.donations = [];
        this.filtered = [];
        this.homeFiltered = [];
        this.foundAnimal = "";
        this.animals = JSON.parse(localStorage.getItem('animal')) || [];
        if (!this.animals.length) {
            this.animals = data.map(animal => new Animal(
                animal.name,
                animal.image,
                animal.type,
                animal.bread,
                animal.age,
                animal.sex,
                animal.neededAmount,
                animal.currentlyRisedAmount
            )
            );
            localStorage.setItem('animal', JSON.stringify(this.animals));
        }

        console.log(this.animals);
    }

    all() {
        return JSON.parse(localStorage.getItem('animal'));
    }

    findAnimal(animal) {
        return this.foundAnimal = this.donations.find(element => element.name == animal);
    }

    isAdopted = (animalName, adoptedAnimals) => {
        return adoptedAnimals.some((animal) => animal.name === animalName);
    }

    allAdopted() {
        return JSON.parse(localStorage.getItem('adopted')) || [];
    }

    adopt(name) {
        const adoptedAnimal = this.animals.find(animal => animal.name == name);
        const exists = this.existsInAdopted(adoptedAnimal);
    
        if (exists) {
            return;
        }
    
        const clonedAnimal = new Animal(
            adoptedAnimal.name,
            adoptedAnimal.image,
            adoptedAnimal.type,
            adoptedAnimal.bread,
            adoptedAnimal.age,
            adoptedAnimal.sex,
            adoptedAnimal.neededAmount,
            adoptedAnimal.currentlyRisedAmount
        );
    
        this.adopted.push(clonedAnimal);
        this.animals = this.animals.filter(animal => animal.name !== name);
        localStorage.setItem('adopted', JSON.stringify(this.adopted));
        localStorage.setItem('animal', JSON.stringify(this.animals));
        this.removeFromLocalStorage(name); // Remove from local storage

    }
    
    removeFromAdopted(name) {
        const adoptedAnimal = this.adopted.find(animal => animal.name === name);
        if (!adoptedAnimal) {
          return; // Animal not found in adopted array
        }
        
        const clonedAnimal = new Animal(
          adoptedAnimal.name,
          adoptedAnimal.image,
          adoptedAnimal.type,
          adoptedAnimal.bread,
          adoptedAnimal.age,
          adoptedAnimal.sex,
          adoptedAnimal.neededAmount,
          adoptedAnimal.currentlyRisedAmount
        );
      
        this.animals.push(clonedAnimal);
        this.adopted = this.adopted.filter(animal => animal.name !== name);
        localStorage.setItem('adopted', JSON.stringify(this.adopted));
        localStorage.setItem('animal', JSON.stringify(this.animals));
      
      }
      

    removeFromLocalStorage(name) {
        let animals = this.all();
        let updatedAnimals = animals.filter(animal => animal.name !== name);
        localStorage.setItem('animal', JSON.stringify(updatedAnimals));
    }

    existsInAdopted(animal) {
        const exists = this.adopted.find(item => item.name == animal.name);

        if (exists) {
            return true;
        }
        return false;
    }

    donate = (animal) => {
        let donation = this.donations.find(animalItem => animalItem.name === animal.name);

        if (!donation) {
            this.donations.push(new Donation(animal));
        }
        
    }

    applySearch(keyword) {
        let arr = this.animals;

        this.filtered = arr.filter(animal => {
            return animal.name.toLowerCase().includes(keyword.toLowerCase().trim());
        });

        return this.filtered;
    }

    neededAmount(animal, value) {
        let neededSum = this.animals.find(element => element.name === animal.name);
        console.log(neededSum);
        
        let sum = neededSum.currentlyRisedAmount + Number(value);
        
        if (neededSum.neededAmount > neededSum.currentlyRisedAmount) {
          if (sum > neededSum.neededAmount) {
            sum = neededSum.neededAmount - neededSum.currentlyRisedAmount;
            neededSum.currentlyRisedAmount += sum;
          } else {
            neededSum.currentlyRisedAmount = sum;
          }
          
          // Save the updated animals array to the local storage
          localStorage.setItem('animal', JSON.stringify(this.animals));
          
          return sum;
        }
        
        sum = "You can't donate more";
        return sum;
      }
      

    filterByType(type) {
        let arr = this.animals;
        return this.filtered = arr.filter(animal => animal.type === type);
    }

}