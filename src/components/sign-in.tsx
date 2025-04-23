
import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={() => {
        
        signIn()
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  )
} 