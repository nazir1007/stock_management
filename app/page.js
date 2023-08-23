"use client";
import Header from "./component/Header";
import { useState, useEffect } from "react";

export default function Home() {
	const [productForm, setProductForm] = useState({});
	const [products, setProducts] = useState([]);
	const [alert, setAlert] = useState("");
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [dropdown, setDropdown] = useState([]);
	const [loadingaction, setLoadingaction] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			const response = await fetch("/api/product");
			let resJson = await response.json();
			setProducts(resJson.products);
		};
		fetchProducts();
	}, []);

	const buttonAction = async (action, slug, initialQuantity) => {
		let index = products.findIndex((item) => item.slug == slug);
		let newProducts = JSON.parse(JSON.stringify(products));
		if (action == "plus") {
			newProducts[index].quantity = parseInt(initialQuantity) + 1;
		} else {
			newProducts[index].quantity = parseInt(initialQuantity) - 1;
		}
		setProducts(newProducts);

		let indexdrop = dropdown.findIndex((item) => item.slug == slug);
		let newDropdown = JSON.parse(JSON.stringify(dropdown));
		if (action == "plus") {
			newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1;
		} else {
			newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1;
		}
		setDropdown(newDropdown);
		console.log(action, slug);
		setLoadingaction(true);
		const response = await fetch("/api/action", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(action, slug, initialQuantity),
		});
		let res = await response.json();
		console.log(res);
		setLoadingaction(false);
	};

	const addProduct = async (e) => {
		try {
			const response = await fetch("/api/product", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productForm),
			});

			if (response.ok) {
				console.log("Product added successfully");
				setAlert("Your Product has been added!");
				setProductForm({});
			} else {
				console.error("Error adding product");
			}
		} catch (error) {
			console.error("Error:", error);
		}
		const response = await fetch("/api/product");
		let resJson = await response.json();
		setProducts(resJson.products);
		e.preventDefault();
	};

	const handleChange = (e) => {
		setProductForm({ ...productForm, [e.target.name]: e.target.value });
	};

	const onDropdownEdit = async (e) => {
		let value = e.target.value;
		setQuery(value);
		if (value.length > 3) {
			setLoading(true);
			setDropdown([]);
			const response = await fetch("/api/search?query=" + query);
			let resJson = await response.json();
			setDropdown(resJson.products);
			setLoading(false);
		} else {
			setDropdown([]);
		}
	};

	return (
		<>
			<Header />
			<div className='container mx-auto my-8'>
				<div className='text-green-800 text-center'>{alert}</div>
				<h1 className='text-3xl font-semibold mb-6'>Search a product</h1>
				<div className='flex mb-6'>
					<input
						onChange={onDropdownEdit}
						type='text'
						placeholder='Enter a product name'
						className='flex-1 border border-gray-300 px-4 py-2 rounded-r-md'
					/>
					<select className='border border-gray-300 px-4 py-2 rounded-r-md'>
						<option value='all'>All</option>
						<option value='available'>Available</option>
						<option value='outOfStock'>Out of Stock</option>
					</select>
				</div>
				{loading && (
					<div className='flex justify-center items-center'>
						{" "}
						<svg
							fill='#000000'
							height='180px'
							width='180px'
							version='1.1'
							id='Layer_1'
							viewBox='0 0 330 330'
						>
							<circle
								className='spinner-path'
								cx='25'
								r='20'
								fill='none'
								strokeWidth='4'
								strock='#000'
								strokeDasharray='31.415, 31.415'
								strokeDashoffset='0'
							>
								<animate
									attributeName='strokeDashoffset'
									repeatCount='indefinite'
									dur='1.5s'
									from='0'
									to='62.83'
								/>
								<animate
									attributeName='strokeDasharray'
									repeatCount='indefinite'
									dur='1.5s'
									values='31.415, 31.415; 0, 62.83; 31.415, 31.415'
								/>
							</circle>
						</svg>
					</div>
				)}
				<div className='dropcontainer absolute w-[72vw] border-1 bg-purple-100 rounded-md'>
					{Array.isArray(dropdown) &&
						dropdown.map((item) => {
							return (
								<div
									key={item.slug}
									className='container flex justify-between p-2 my-1 border-b-2'
								>
									<span className='slug'>
										{item.slug} ({item.quantity} available for ₹{item.price})
									</span>
									<div className='mx-5'>
										<button
											onClick={() => {
												buttonAction("minus", item.slug, item.quantity);
											}}
											disabled={loadingaction}
											className='subtract inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md'
										>
											{" "}
											-{" "}
										</button>
										<span className='quantity mx-3'>{item.quantity}</span>
										<button
											onClick={() => {
												buttonAction("plus", item.slug, item.quantity);
											}}
											disabled={loadingaction}
											className='add inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md'
										>
											{" "}
											+{" "}
										</button>
									</div>
								</div>
							);
						})}
				</div>
			</div>
			<div className='container bg-red-50 mx-auto'>
				<h1 className='text-3xl font-bold mb-6'>Add a Product</h1>
				<form>
					<div className='mb-4'>
						<label htmlFor='productName' className='block mb-2'>
							Product Slug
						</label>
						<input
							value={productForm?.slug || ""}
							name='slug'
							onChange={handleChange}
							type='text'
							id='productName'
							className='w-full border border-gray-300 px-4 py-2'
						/>
					</div>
					<div>
						<label htmlFor='quantity' className='block mb-2'>
							Quantity
						</label>
						<input
							value={productForm?.quantity || ""}
							name='quantity'
							onChange={handleChange}
							type='number'
							id='quantity'
							className='w-full border border-gray-300 px-4 py-2'
						/>
					</div>
					<div>
						<label htmlFor='price' className='block mb-2'>
							Price
						</label>
						<input
							value={productForm?.price || ""}
							name='price'
							onChange={handleChange}
							type='number'
							id='price'
							className='w-full border border-gray-300 px-4 py-2 mb-2'
						/>
					</div>
					<button
						onClick={addProduct}
						type='submit'
						className='bg-blue-500 text-white px-4 py-2'
					>
						Add Product
					</button>
				</form>
			</div>

			<div className='container my-6  mx-auto'>
				<h1 className='text-3xl font-bold mb-6'>Display Current Stock</h1>

				<table className='table-auto w-full'>
					<thead>
						<tr>
							<th className='px-4 py-2'>Product Name</th>
							<th className='px-4 py-2'>Quantity</th>
							<th className='px-4 py-2'>Price</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => {
							return (
								<tr key={product.slug}>
									<td>{product.slug}</td>
									<td>{product.quantity}</td>
									<td>₹{product.price}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}
