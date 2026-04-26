export default function SkeletonLoader({ lines = 3, gap = 10, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{
          height: 13,
          width: i === lines - 1 ? '55%' : i % 2 === 0 ? '100%' : '85%',
          borderRadius: 4
        }} />
      ))}
    </div>
  )
}