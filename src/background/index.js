import requests from './requests';
import tabs from './tabs';

requests.init();

global.adguard = {
    requests,
    tabs,
};
