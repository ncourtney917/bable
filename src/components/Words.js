import nameBank from "../names.txt";

export function Words(letterCount) {
    const boardDefault = [
        Array(letterCount).fill(""),
        Array(letterCount).fill(""),
        Array(letterCount).fill(""),
        Array(letterCount).fill(""),
        Array(letterCount).fill(""),
        Array(letterCount).fill("")
    ];
    return (
        boardDefault
    )
};

export const generateNameList = async () => {
    let nameSet;
    await fetch(nameBank)
      .then((response) => response.text())
      .then((result) => {
        // Split on either \n or \n\r
        const nameArr = result.split(/[(\r)?\n]/);
        nameSet = new Set(nameArr);
      });
    return { nameSet };
  };