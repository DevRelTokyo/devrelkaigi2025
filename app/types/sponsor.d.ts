export interface Sponsor extends Parse.Object {
  name: string;
  level: string;
  logo: {
    __type: string;
    name: string;
    url: string;
  }
  url: string;
  year: number;
}
