export default function Button() {
  const handler = () => {
    alert('click')
  }
  return <button onClick={handler}>我是按钮</button>
}
