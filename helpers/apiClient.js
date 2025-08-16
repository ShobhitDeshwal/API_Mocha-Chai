import request from 'supertest';
import config from 'config';

export const api = () => request(config.get('baseUrl'));
