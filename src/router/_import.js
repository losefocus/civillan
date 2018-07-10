module.exports = (file, path) => {
  if (!path) path = 'page'
  console.log(file, path)
  return require(`../${path}/${file}.vue`)
}
