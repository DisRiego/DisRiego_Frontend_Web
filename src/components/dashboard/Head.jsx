const Head = ({date}) => {
    console.log(date)
  return (
    <>
        <h1>Head</h1>
        <p className="title">{date.title}</p>
        <p>{date.description}</p>
    </>
  )
}

export default Head