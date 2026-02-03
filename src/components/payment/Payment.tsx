import { $, component$, QRL, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { _ } from 'compiled-i18n';
import { APP_STATE } from '~/constants';
import { getEligiblePaymentMethodsQuery } from '~/providers/shop/checkout/checkout';
import { EligiblePaymentMethods } from '~/types';
import { pushToDataLayer } from '~/utils';
import CreditCardIcon from '../icons/CreditCardIcon';
import BraintreePayment from './BraintreePayment';
import StripePayment from './StripePayment';

export default component$<{ onForward$: QRL<() => void> }>(({ onForward$ }) => {
	const appState = useContext(APP_STATE);
	const paymentMethods = useSignal<EligiblePaymentMethods[]>();

	useVisibleTask$(async () => {
		paymentMethods.value = await getEligiblePaymentMethodsQuery();
	});

	return (
		<div class="flex flex-col space-y-24 items-center">
			{paymentMethods.value?.map((method) => (
				<div key={method.code} class="flex flex-col items-center">
					{method.code === 'standard-payment' && (
						<>
							<p class="text-gray-600 text-sm p-6">
								{_`This is a dummy payment for demonstration purposes only`}
							</p>
							<button
								class="flex px-6 bg-primary-600 hover:bg-primary-700 items-center justify-center space-x-2 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
								onClick$={$(async () => {
									console.log('💳 Payment method selected (Purchase):', method.name);
									const trackingData = {
										event: 'purchase',
										ecommerce: {
											transaction_id: appState.activeOrder?.code,
											currency: appState.activeOrder?.currencyCode || 'USD',
											value: (appState.activeOrder?.subTotal || 0) / 100,
											tax:
												((appState.activeOrder?.subTotalWithTax || 0) -
													(appState.activeOrder?.subTotal || 0)) /
												100,
											shipping:
												((appState.activeOrder?.total || 0) -
													(appState.activeOrder?.subTotal || 0)) /
												100,
											coupon: appState.activeOrder?.couponCodes?.[0] || '',
											// payment_type: method.name, // purchase event doesn't typically use payment_type in standard GA4, but good to keep if custom
											items: (appState.activeOrder?.lines || []).map((line: any) => ({
												item_id: line.productVariant.sku,
												item_name: line.productVariant.product.name,
												item_variant: line.productVariant.name,
												price: line.unitPrice / 100,
												quantity: line.quantity,
											})),
										},
									};
									console.log('📊 Tracking data (purchase):', trackingData);
									pushToDataLayer(trackingData);
									onForward$();
								})}
							>
								<CreditCardIcon />
								<span>{_`Pay with ${method.name}`}</span>
							</button>
						</>
					)}
					{method.code.includes('stripe') && <StripePayment />}
					{method.code.includes('braintree') && <BraintreePayment />}
				</div>
			))}
		</div>
	);
});
