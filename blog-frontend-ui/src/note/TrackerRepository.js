import {v4 as uuidv4} from 'uuid';

class TrackerRepository {

    loadTracker() {
        return window.localStorage.getItem('tracker') || this.generate();
    }

    generate() {
        const uuid = uuidv4();
        window.localStorage.setItem('tracker', uuid);
        return uuid;
    }

    clear() {
        window.localStorage.removeItem('tracker');
    }
}

export default new TrackerRepository();