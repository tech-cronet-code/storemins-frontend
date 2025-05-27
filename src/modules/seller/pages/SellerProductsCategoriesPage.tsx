import { UserRoleName } from '../../auth/constants/userRoles'
import Layout from '../../dashboard/components/Layout'
import SellerProductsCategoriesContainer from '../containers/SellerProductsCategoriesContainer'

const SellerProductsCategoriesPage = () => {
  return (
    <>
     <Layout role={UserRoleName.SELLER}>
   <SellerProductsCategoriesContainer/>
    </Layout>
  </>
  )
}

export default SellerProductsCategoriesPage