function PageContent({ title, children }) {
  return (
    <div style={{textAlign: 'center'}}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export default PageContent;