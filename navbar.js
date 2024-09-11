import { User } from './objects/User.js';

export class NavBar {

    constructor(api) {
        this.api = api;
        api.getUserData().then(user => {
            if (user != null) {
                this.initNavBar(user);
                console.warn(user.getUsername());
            }
        });
    }

    /**
     * 
     * @param {User} api 
     */
    refresh(user) {
        if (user != null) {
            this.initNavBar(user);
            console.warn(user.getUsername());
        }
    }

    /**
     * 
     * @param {User} user 
     */
    initNavBar(user) {
        this.removeCurrentAccount();

        var nav_item = document.createElement('li');
        nav_item.className = 'nav-item dropdown';
        nav_item.id = 'account';

        var nav_item_name = document.createElement('a');
        nav_item_name.className = 'nav-link dropdown-toggle';
        nav_item_name.style.cursor = 'pointer';
        nav_item_name.id = 'navbarDropdown';
        nav_item_name.role = 'button';
        nav_item_name.setAttribute('data-bs-toggle', 'dropdown');
        nav_item_name.setAttribute('aria-expanded', 'false');
        nav_item_name.innerText = user.getUsername();

        var avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = user.avatar === undefined ? "/pics/discordred.png" : user.avatar;
        nav_item_name.appendChild(avatar);

        var dropdown = document.createElement('ul');
        dropdown.className = 'dropdown-menu dropdown-menu-end';
        dropdown.setAttribute('aria-labelledby', 'navbarDropdown');

        var item_action1 = document.createElement('a');
        item_action1.className = 'dropdown-item';
        item_action1.href = 'account.html';
        item_action1.innerText = 'My layouts';

        var dropDownItemMyLayouts = document.createElement('li');
        //dropDownItemMyLayouts.innerHTML = 'My layouts';
        dropDownItemMyLayouts.appendChild(item_action1);
        dropdown.appendChild(dropDownItemMyLayouts);

        var item_action2 = document.createElement('a');
        item_action2.className = 'dropdown-item';
        item_action2.style.cursor = 'pointer';
        item_action2.innerText = 'Logout';

        var dropDownItemLogout = document.createElement('li');
        //dropDownItemLogout.onclick = function() {
        //    this.logout();
        //};
        dropDownItemLogout.addEventListener('click', () => {
            this.logout();
        });
        //dropDownItemLogout.innerHTML = 'Logout';
        dropDownItemLogout.appendChild(item_action2);
        dropdown.appendChild(dropDownItemLogout);

        nav_item.appendChild(nav_item_name);
        nav_item.appendChild(dropdown);

        document.getElementById('navBar').appendChild(nav_item);
    }

    logout() {
        this.removeCurrentAccount();

        var nav_item = document.createElement('li');
        nav_item.className = 'nav-item';
        nav_item.id = 'account';

        var link = document.createElement('a');
        link.className = 'nav-link';
        link.href = 'login.html';
        link.innerHTML = 'Login';
        nav_item.appendChild(link);

        document.getElementById('navBar').appendChild(nav_item);
        this.api.removeUserData();
    }

    removeCurrentAccount() {
        var button = document.getElementById('account');
        button.remove();
    }
}