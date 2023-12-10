/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

'use strict';

import { database, changePanel, accountSelect, Slider } from '../utils.js';
const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)

const os = require('os');

class Accounts {
    static id = "comptes";
    async init(config) {
        this.config = config;
        this.database = await new database().init();
        this.initSettingsDefault();
        this.initTab();
        this.initAccount();
    }

    initAccount() {
        document.querySelector('.accounts').addEventListener('click', async(e) => {
            let uuid = e.target.id;
            let selectedaccount = await this.database.get('1234', 'accounts-selected');

            if (e.target.classList.contains('account')) {
                console.log(uuid);
                accountSelect(uuid);
                this.database.update({ uuid: "1234", selected: uuid }, 'accounts-selected');
            }

            if (e.target.classList.contains("account-delete")) {
                this.database.delete(e.target.parentElement.id, 'accounts');

                document.querySelector('.accounts').removeChild(e.target.parentElement)
                if (!document.querySelector('.accounts').children.length) {
                    changePanel("login");
                    return
                }

                if (uuid === selectedaccount.value.selected) {
                    let uuid = (await this.database.getAll('accounts'))[0].value.uuid
                    this.database.update({
                        uuid: "1234",
                        selected: uuid
                    }, 'accounts-selected')
                    accountSelect(uuid)
                }
            }
        })

        document.querySelector('.add-account').addEventListener('click', () => {
            document.querySelector(".cancel-login").style.display = "contents";
            changePanel("login");
        })
    }

    initTab() {
        let TabBtn = document.querySelectorAll('.accounts_tab-btn');
        let TabContent = document.querySelectorAll('.accounts_tabs-settings-content');

        for (let i = 0; i < TabBtn.length; i++) {
            TabBtn[i].addEventListener('click', () => {
                if (TabBtn[i].classList.contains('accounts_save-tabs-btn')) return
                for (let j = 0; j < TabBtn.length; j++) {
                    TabContent[j].classList.remove('accounts_active-tab-content');
                    TabBtn[j].classList.remove('accounts_active-tab-btn');
                }
                TabContent[i].classList.add('accounts_active-tab-content');
                TabBtn[i].classList.add('accounts_active-tab-btn');
            });
        }

        document.querySelector('.accounts_save-tabs-btn').addEventListener('click', () => {
            // document.querySelector('.accounts_default-tab-btn').click();
            changePanel("home");
        })
    }

    async initSettingsDefault() {
        if (!(await this.database.getAll('accounts-selected')).length) {
            this.database.add({ uuid: "1234" }, 'accounts-selected')
        }

    }
}
export default Accounts;