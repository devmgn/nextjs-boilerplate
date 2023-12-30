import type { Axios, AxiosInstance } from 'axios';

interface ApiClientInterface {
  get: Axios['get'];
  post: Axios['post'];
}

export class ApiClient implements ApiClientInterface {
  private readonly client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  public async get<T>(...params: Parameters<Axios['get']>): Promise<T> {
    return this.client.get<T>(...params).then((res) => res.data);
  }

  public async post<T>(...params: Parameters<Axios['post']>): Promise<T> {
    return this.client.post<T>(...params).then((res) => res.data);
  }
}
