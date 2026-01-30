function Home() {
    return (
        <div style={{
            width: 'full'
            , height: '100%'
            , alignItems: 'center'
            , justifyContent: 'center'
            , textAlign: 'center'
        }}>
            <h1>Home</h1>
            <div style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'
                , flexWrap: 'wrap'
            }}>
                <a href="/Dogcat">
                    <h1>DogCat</h1></a>
                <a href="/Wand">
                    <h1>Wand</h1></a>
                <a href="/Hand">
                    <h1>Hand</h1></a>
            </div>
        </div>
    )
}

export default Home;