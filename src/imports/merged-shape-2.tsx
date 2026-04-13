const MergedShape = ({ fill = "#ffffff", children, style: containerStyle, ...props }) => (
  <div
    style={{
      position: 'relative',
      width: 400,
      height: 280,
      ...containerStyle,
    }}
    {...props}
  >
      {/* Shape 1 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 200,
          height: 280,
          backgroundColor: fill,
          borderRadius: '32px 32px 32px 32px',
        }}
      >
        {/* Add content here */}
      </div>
      {/* Shape 2 */}
      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 50,
          width: 200,
          height: 140,
          backgroundColor: fill,
          borderRadius: '0px 32px 32px 0px',
        }}
      >
        {/* Add content here */}
      </div>
      {/* Negative Space 1 - Content container for empty region */}
      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 0,
          width: 200,
          height: 50,
          // Transparent container for content in negative space
        }}
      >
        {/* Add content here */}
      </div>
      {/* Negative Space 2 - Content container for empty region */}
      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 190,
          width: 200,
          height: 90,
          // Transparent container for content in negative space
        }}
      >
        {/* Add content here */}
      </div>
      {/* Bridge 1 */}
      <svg
        style={{
          position: 'absolute',
          left: 200,
          top: 18,
          width: 32,
          height: 32,
          pointerEvents: 'none',
        }}
        viewBox="0 0 32 32"
      >
        <path d="M 0 0 C 0 23.872 5.76 32 32 32 H 0 Z" fill={fill} />
      </svg>
      {/* Bridge 2 */}
      <svg
        style={{
          position: 'absolute',
          left: 200,
          top: 190,
          width: 32,
          height: 32,
          pointerEvents: 'none',
        }}
        viewBox="0 -32 32 32"
      >
        <path d="M 0 0 C 0 -23.872 5.76 -32 32 -32 H 0 Z" fill={fill} />
      </svg>
    {children}
  </div>
);

export default MergedShape;