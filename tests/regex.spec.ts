import { REGEX } from "../src/index";

type Fixture = {
  input: string;
  expect: null | {
    insertedText: string | undefined;
  };
};

describe("remark-flexigraph regex tests", () => {
  it("REGEX_IN_BEGINNING matches or not", () => {
    const fixtures: Fixture[] = [
      {
        input: "++",
        expect: null,
      },
      {
        input: "+++",
        expect: null,
      },
      {
        input: "+ ++",
        expect: null,
      },
      {
        input: "++  +",
        expect: null,
      },
      {
        input: "+ +inserted++",
        expect: null,
      },
      {
        input: "+a+inserted++",
        expect: null,
      },
      {
        input: "++++",
        expect: null,
      },
      {
        input: "++ ++",
        expect: null,
      },
      {
        input: "++  ++",
        expect: null,
      },
      {
        input: "++ inserted inserted++",
        expect: null,
      },
      {
        input: "++inserted inserted ++",
        expect: null,
      },
      //********************************* */
      {
        input: "++inserted text++",
        expect: {
          insertedText: "inserted text",
        },
      },
      {
        input: "++inserted++ outer++",
        expect: {
          insertedText: "inserted",
        },
      },
      // TODO: how to match the shorter ?
      {
        input: "++outer ++inserted++",
        expect: {
          insertedText: "outer ++inserted",
        },
      },
    ];

    fixtures.forEach((fixture) => {
      // console.log(fixture.input);

      const match = fixture.input.match(REGEX);

      if (fixture.expect === null) {
        expect(match).toBeNull();
      } else {
        expect(match).not.toBeNull();
      }

      if (match) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, insertedText] = match;

        expect(insertedText).toBe(fixture.expect?.insertedText);
      }
    });
  });
});
