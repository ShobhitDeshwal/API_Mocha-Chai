import {api} from './apiClient.js'
import config from 'config';

export async function getAuthToken(){
    const res = await api
    .post('/')
    .send({
        username:config.get('auth.username'),
        password:config.get('auth.password')
    });

    const token = await res.body.token;
    return token;
}