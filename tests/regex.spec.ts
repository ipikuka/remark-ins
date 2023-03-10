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
      //********************************* */
      {
        input: "++++",
        expect: {
          insertedText: undefined,
        },
      },
      {
        input: "++ ++",
        expect: {
          insertedText: undefined,
        },
      },
      {
        input: "++  ++",
        expect: {
          insertedText: undefined,
        },
      },
      {
        input: "++inserted++",
        expect: {
          insertedText: "inserted",
        },
      },
      {
        input: "++ inserted inserted    ++",
        expect: {
          insertedText: "inserted inserted",
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
