export interface IFruit {
  name: string
  image: {
    author: {
      name: string
      url: string
    }
    color: string
    url: string
  }
  metadata: {
    name: string
    value: string
  }[]
}

export interface Site {
  uid: string;
  siteId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  address: string;
  location: string;
  lat: string;
  lng: string;
  description: string;
  imgUrl: string | null;
  wikiUrl: string | null;
  primarySite: boolean | null;
}