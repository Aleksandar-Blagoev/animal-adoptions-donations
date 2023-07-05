class User {
  constructor(user, pass) {
    this.username = user;
    this.pass = pass;
    this.donates = [];
  }
}

class UserManager {
  constructor() {
    let loggedUser = JSON.parse(localStorage.getItem("isThereUser"));
    if (loggedUser) {
      this.loggedUser = new User(loggedUser.username, loggedUser.pass);
    }

    this.users = JSON.parse(localStorage.getItem("users")) || [];

    // Update local storage when users change
    this.updateLocalStorage();
  }

  loggedUser = null;
  users = [new User("slavi", "bahur"), new User("bahur", "slavi")];

  login = ({ username, pass }) => {
    let foundUser = this.users.find(
      (user) =>
        user.username === username.toLowerCase() && user.pass === pass
    );

    if (foundUser) {
      this.loggedUser = foundUser;
      localStorage.setItem("isThereUser", JSON.stringify(this.loggedUser));
      return true;
    } else {
      alert("Wrong credentials");
      return false;
    }
  };

  register = ({ username, pass }) => {
    console.log('Register method called');
    let foundUser = this.users.find((user) => user.username === username.toLowerCase());

    console.log('Found User:', foundUser);

    if (!foundUser) {
      let newUser = new User(username, pass);
      this.users.push(newUser);

      console.log('New user added:', newUser);

      this.updateLocalStorage();

      console.log('Users:', this.users);

      return true;
    }

    return false;
  };

  logout = () => {
    if (this.loggedUser) {
      const currentUserIndex = this.users.findIndex(user => user.username === this.loggedUser.username);

      if (currentUserIndex !== -1) {
        this.users[currentUserIndex] =  JSON.parse(localStorage.getItem("isThereUser"));
      }
      localStorage.removeItem("isThereUser");
      this.updateLocalStorage();
      this.loggedUser = null;
    }
  };



  IsNameTaken(username) {
    let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    let names = storedUsers.map((obj) => obj.username);
    return names.includes(username.toLowerCase());
  }


  updateLocalStorage() {
    localStorage.setItem("users", JSON.stringify(this.users));
  }
}

let userManager = new UserManager();
