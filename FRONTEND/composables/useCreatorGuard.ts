import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

export const useCreatorGuard = () => {
  const userStore = useUserStore()
  const router = useRouter()

  const checkAccess = () => {
    const user = userStore.getUser
    if (!user || user.role !== 'CREATOR') {
      router.push('/unauthorized')
    }
  }

  return { checkAccess }
}
