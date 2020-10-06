import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/header/login/login.component';
import { RegisterComponent } from './components/header/register/register.component';
import { TermsUseComponent } from './components/footer/terms-use/terms-use.component';
import { FaqComponent } from './components/footer/faq/faq.component';
import { ContactComponent } from './components/footer/contact/contact.component';
import { CommentsComponent } from './components/footer/comments/comments.component';
import { PrivacyPolicyComponent } from './components/footer/privacy-policy/privacy-policy.component';
import { RegisterInfoComponent } from './components/header/register/register-info/register-info.component';
import { AdminComponent } from './components/admin/admin.component';
import { LogoutComponent } from './components/header/logout/logout.component';
import { RegisterIdUserComponent } from './components/header/register/register-id-user/register-id-user.component';
import { UserProfileComponent } from './components/header/user-profile/user-profile.component';
import { ClientComponentComponent } from './components/admin/clients/client-component/client-component.component';
import { ClientInfoComponentComponent } from './components/admin/clients/client-info-component/client-info-component.component';
import { ForgetPassComponent } from './components/header/login/forgetPass/forgetPass/forget-pass.component';
import { ChangePasswordComponent } from './components/header/login/change-password/change-password.component';
import { OrdersComponent } from './components/admin/orders/orders/orders.component';
import { InvoicesComponent } from './components/admin/orders/invoices/invoices.component';
import { ProductsComponent } from './components/admin/catalogue/products/products.component';
import { ProductsDetailComponent } from './components/admin/catalogue/products/products-detail/products-detail.component';
import { InitPageComponent } from './components/init-page/init-page.component';
import { ImportDataComponent } from './components/admin/import-data/import-data.component'
import { BrandsCategoriesComponent } from './components/admin/catalogue/brands-categories/brands-categories.component';
import { CustomerServiceComponentComponent } from './components/admin/customerService/customer-service-component/customer-service-component.component';
import { OffersComponentComponent } from './components/admin/offers/offers-component/offers-component.component';
import { CategorieHomeComponent } from './components/client/categorie-home/categorie-home.component';
import { ProductDetailClientComponent } from './components/client/product-detail-client/product-detail-client.component';
import { ProductsListComponentComponent } from './components/client/products-list-component/products-list-component.component';
import { CartComponentComponent } from './components/client/cart-component/cart-component.component';
import { PaymentMethodsComponent } from './components/client/payment-methods/payment-methods.component';
import { SumaryComponentComponent } from './components/client/sumary-component/sumary-component.component';
import  { OrdersProfileComponentComponent } from './components/header/orders-profile-component/orders-profile-component.component';
import  { MessagesComponentsComponent } from './components/admin/messages/messages-components/messages-components.component';;

const routes: Routes = [
  // { path: '/',   component: InitPageComponent },
  { path: 'home', component: InitPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'registerInfo', component: RegisterInfoComponent },
  { path: 'register/:idUser', component: RegisterIdUserComponent },
  { path: 'termsUse', component: TermsUseComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'comments', component: CommentsComponent },
  { path: 'privacyPolicy', component: PrivacyPolicyComponent },
  { path: 'user/:idUser', component: UserProfileComponent },
  { path: 'orders/:idUser', component: OrdersProfileComponentComponent },
  {path: 'home/largeAppliances', component: CategorieHomeComponent},
  {path: 'home/smallKitchenAppliances', component: CategorieHomeComponent},
  {path: 'home/image', component: CategorieHomeComponent},
  {path: 'home/sound', component: CategorieHomeComponent},
  {path: 'home/telephony', component: CategorieHomeComponent},
  {path: 'home/personalCare', component: CategorieHomeComponent},
  {path: 'home/cleaning', component: CategorieHomeComponent},
  {path: 'home/airConditioning', component: CategorieHomeComponent},
  {path: 'home/computing', component: CategorieHomeComponent},
  {path: 'home/product/:idProduct', component: ProductDetailClientComponent},
  {path: 'home/category/:nameCategory', component: ProductsListComponentComponent},
  {path: 'home/cart', component: CartComponentComponent},
  {path: 'paymentsMethod/:idclient', component: PaymentMethodsComponent },
  {path: 'sumaryOrder/:idclient', component: SumaryComponentComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'clients',
        component: ClientComponentComponent,
      },
      {
        path: 'clients/:idUser',
        component: ClientInfoComponentComponent
      },
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'products/:id',
        component: ProductsDetailComponent
      },
      {
        path: 'import',
        component: ImportDataComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path:'brandsCategories',
        component: BrandsCategoriesComponent
      },
      {
        path: 'customerService',
        component: CustomerServiceComponentComponent
      },
      {
        path: 'offers',
        component: OffersComponentComponent
      },
      {
        path:'invoices',
        component: InvoicesComponent
      },
      {
        path:'messages',
        component: MessagesComponentsComponent
      },
      {
        path:'**',
        redirectTo: 'orders'
      }
    ]
  },
  { path: 'logout', component: LogoutComponent },
  { path: 'forgetPassword', component: ForgetPassComponent },
  { path: 'forgetPassword/:idUSer', component: ChangePasswordComponent },
  {path: '**', redirectTo: 'home' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
