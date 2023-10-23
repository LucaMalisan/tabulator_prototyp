class Helper {
  static generateJson(n) {
    let data = [];
    let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
      'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let col = ["red", "blue", "green", "maroon", "orange", "yellow"]

    for (let i = 0; i < n; i++) {
      let name = "";
      let surname = "";

      name += alphabet[Math.floor(
          Math.random() * alphabet.length)].toUpperCase()
      surname += alphabet[Math.floor(
          Math.random() * alphabet.length)].toUpperCase()

      for (let i = 0; i < 3; i++) {
        name += alphabet[Math.floor(Math.random() * alphabet.length)]
        surname += alphabet[Math.floor(Math.random() * alphabet.length)]
      }

      data.push(
          {
            id: i,
            name: `${name} ${surname}`,
            col: col[Math.floor(Math.random() * col.length)],
            dob: new Date(Math.random() * 0xFFFFFFFFFF).toLocaleDateString(
                'en-GB'),
            dwit: Math.round(Math.random() * 0xFFF),
            available: `<span class=\"material-symbols-outlined\"> ${Math.random()
            >= 0.5 ? "close" : "done_outline"} </span>`
          }
      )
    }
    console.log(data)
  }
}