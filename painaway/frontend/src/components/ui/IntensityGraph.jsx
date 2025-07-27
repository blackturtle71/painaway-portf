const IntensityGraph = ({ date, intensity }) => (
  <div className="pain-intensity">
    <div className="date">{date}</div>
    <div className="intensity-scale">
      <div
        className={`pain-level intensity-${intensity}`}
        style={{ width: `${(intensity / 10) * 100}%` }}
        title={`Интенсивность: ${intensity}`}
      />
      <div className="pain-scale-numbers">
        {[...Array(11).keys()].map(num => (
          <span key={num} className="pain-number">{num}</span>
        ))}
      </div>
    </div>
  </div>
)

export default IntensityGraph
