const GameWrapper = (props) => <div className="container">
    <div className="game-wrapper">
        {props.children}
    </div>
</div>;

export default GameWrapper;