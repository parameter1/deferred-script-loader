import { EVENTS } from '../constants';

export default (on) => on && EVENTS.includes(on);
