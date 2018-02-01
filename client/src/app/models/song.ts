export class Song {
  public title: string;
  public artist: {
    userId: number,
    name: string
  };
  public buffer: any;
  public length: number;
  public id: string;
  public description: string;
  public tags: string;
}
