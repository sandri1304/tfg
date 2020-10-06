import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Ng5SliderModule } from 'ng5-slider';

import { CookieService } from 'ngx-cookie-service';

import { MatModule } from './mat-module'; // añadimos aqui el fichero con todo lo necesario para utilizar material
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/header/login/login.component';
import { ForgetPassComponent } from './components/header/login/forgetPass/forgetPass/forget-pass.component';
import { RegisterComponent } from './components/header/register/register.component';
import { FaqComponent } from './components/footer/faq/faq.component';
import { TermsUseComponent } from './components/footer/terms-use/terms-use.component';
import { ContactComponent } from './components/footer/contact/contact.component';
import { PrivacyPolicyComponent } from './components/footer/privacy-policy/privacy-policy.component';
import { CommentsComponent } from './components/footer/comments/comments.component';
import { RegisterInfoComponent } from './components/header/register/register-info/register-info.component';
import { AdminComponent } from './components/admin/admin.component';
import { LogoutComponent } from './components/header/logout/logout.component';
import { RegisterIdUserComponent } from './components/header/register/register-id-user/register-id-user.component';
import { UserProfileComponent } from './components/header/user-profile/user-profile.component';
import { ClientComponentComponent } from './components/admin/clients/client-component/client-component.component';
import { ClientInfoComponentComponent } from './components/admin/clients/client-info-component/client-info-component.component';
import { ChangePasswordComponent } from './components/header/login/change-password/change-password.component';
import { OrdersComponent } from './components/admin/orders/orders/orders.component';
import { InvoicesComponent } from './components/admin/orders/invoices/invoices.component';

import 'hammerjs';

import { FormsModule } from '@angular/forms';
import { ProductsComponent } from './components/admin/catalogue/products/products.component';
import { ProductsDetailComponent } from './components/admin/catalogue/products/products-detail/products-detail.component';
import { InfoMessageComponentComponent } from './components/admin/catalogue/products/info-message-component/info-message-component.component';
import { ToastrModule } from 'ngx-toastr';
import { InitPageComponent } from './components/init-page/init-page.component';
import { ImportDataComponent } from './components/admin/import-data/import-data.component';
import { RemoveProductComponenteComponent } from './components/admin/catalogue/products/remove-product-componente/remove-product-componente.component';
import { RemoveClientComponentComponent } from './components/admin/clients/remove-client/remove-client-component/remove-client-component.component';
import { BrandsCategoriesComponent } from './components/admin/catalogue/brands-categories/brands-categories.component';
import { RemoveBrandComponent } from './components/admin/catalogue/brands-categories/remove-brand/remove-brand.component';
import { RemoveCategoryComponent } from './components/admin/catalogue/brands-categories/remove-category/remove-category.component';
import { DetailBrandComponent } from './components/admin/catalogue/brands-categories/detail-brand/detail-brand.component';
import { DetailCategoryComponent } from './components/admin/catalogue/brands-categories/detail-category/detail-category.component';
import { OrdersInfoComponent } from './components/admin/orders/orders/orders-info/orders-info.component';
import { CustomerServiceComponentComponent } from './components/admin/customerService/customer-service-component/customer-service-component.component';
import { RemovePaymentComponent } from './components/admin/customerService/remove-payment/remove-payment.component';
import { RemoveTransportComponent } from './components/admin/customerService/remove-transport/remove-transport.component';
import { DetailPaymentComponent } from './components/admin/customerService/detail-payment/detail-payment.component';
import { DetailTransportComponent } from './components/admin/customerService/detail-transport/detail-transport.component';
import { OffersComponentComponent } from './components/admin/offers/offers-component/offers-component.component';
import { OffersInfoComponent } from './components/admin/offers/offers-info/offers-info.component';
import { RemoveOfferComponent } from './components/admin/offers/remove-offer/remove-offer.component';
import { InvoicesDetailComponent } from './components/admin/orders/invoices/invoices-detail/invoices-detail.component';
import { ClientProductComponent } from './components/client/client-product/client-product.component';
import { ProductRowComponent } from './components/client/product-row/product-row.component';
import { ProductHomeComponent } from './components/client/product-home/product-home.component';
import { CategorieHomeComponent } from './components/client/categorie-home/categorie-home.component';
import { CategorieRowColumComponent } from './components/client/categorie-row-colum/categorie-row-colum.component';
import { ClientCategorieComponent } from './components/client/client-categorie/client-categorie.component';
import { ProductDetailClientComponent } from './components/client/product-detail-client/product-detail-client.component';
import { DetailPhotoProductComponent } from './components/client/detail-photo-product/detail-photo-product.component';
import { ReviewComponentComponent } from './components/client/review-component/review-component.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ProductsListComponentComponent } from './components/client/products-list-component/products-list-component.component';
import { CartComponentComponent } from './components/client/cart-component/cart-component.component';
import { PaymentMethodsComponent } from './components/client/payment-methods/payment-methods.component';
import { SumaryComponentComponent } from './components/client/sumary-component/sumary-component.component';
import { OrdersProfileComponentComponent } from './components/header/orders-profile-component/orders-profile-component.component';
import { MessagesComponentsComponent } from './components/admin/messages/messages-components/messages-components.component';
import { RemoveMessageComponentComponent } from './components/admin/messages/remove-message-component/remove-message-component.component';
import { MessageInfoComponentComponent } from './components/admin/messages/message-info-component/message-info-component.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    FaqComponent,
    TermsUseComponent,
    ContactComponent,
    PrivacyPolicyComponent,
    CommentsComponent,
    RegisterInfoComponent,
    AdminComponent,
    LogoutComponent,
    RegisterIdUserComponent,
    UserProfileComponent,
    ClientComponentComponent,
    ClientInfoComponentComponent,
    ForgetPassComponent,
    ChangePasswordComponent,
    OrdersComponent,
    InvoicesComponent,
    ProductsComponent,
    ProductsDetailComponent,
    InfoMessageComponentComponent,
    InitPageComponent,
    ImportDataComponent,
    RemoveProductComponenteComponent,
    RemoveClientComponentComponent,
    BrandsCategoriesComponent,
    RemoveBrandComponent,
    RemoveCategoryComponent,
    DetailBrandComponent,
    DetailCategoryComponent,
    OrdersInfoComponent,
    CustomerServiceComponentComponent,
    RemovePaymentComponent,
    RemoveTransportComponent,
    DetailPaymentComponent,
    DetailTransportComponent,
    OffersComponentComponent,
    OffersInfoComponent,
    RemoveOfferComponent,
    InvoicesDetailComponent,
    ClientProductComponent,
    ProductRowComponent,
    ProductHomeComponent,
    CategorieHomeComponent,
    CategorieRowColumComponent,
    ClientCategorieComponent,
    ProductDetailClientComponent,
    DetailPhotoProductComponent,
    ReviewComponentComponent,
    ProductsListComponentComponent,
    CartComponentComponent,
    PaymentMethodsComponent,
    SumaryComponentComponent,
    OrdersProfileComponentComponent,
    MessagesComponentsComponent,
    RemoveMessageComponentComponent,
    MessageInfoComponentComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    MatModule,
    FormsModule,
    ToastrModule.forRoot(),
    NgbModule,
    AngularEditorModule,
    Ng5SliderModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents: [ProductsComponent,
                    RemoveProductComponenteComponent,
                    RemoveClientComponentComponent,
                    RemoveBrandComponent,
                    RemoveCategoryComponent,
                    ClientInfoComponentComponent,
                    DetailBrandComponent,
                    DetailCategoryComponent,
                    OrdersInfoComponent,
                    RemovePaymentComponent,
                    RemoveTransportComponent,
                    DetailPaymentComponent,
                    DetailTransportComponent,
                    OffersInfoComponent,
                    RemoveOfferComponent,
                    InvoicesDetailComponent,
                    DetailPhotoProductComponent,
                    ReviewComponentComponent,
                    RemoveMessageComponentComponent,
                    MessageInfoComponentComponent]
})
export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);
