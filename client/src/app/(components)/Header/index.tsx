type HeaderProps = {
  name: string

}

const Header = ({name}: HeaderProps) => {
  return (
    <div className='text-2xl font-semibol text-gray-700'>{name}</div>
  )
}

export default Header