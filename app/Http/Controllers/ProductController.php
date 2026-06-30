<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->success(Product::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
        ]);

        $product = Product::create($request->only('name', 'description', 'price'));

        return $this->success($product, 'Product created successfully', 201);
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return $this->error('Product not found', 404);
        }

        return $this->success($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return $this->error('Product not found', 404);
        }

        $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'sometimes|required|numeric|min:0',
        ]);

        $product->update($request->only('name', 'description', 'price'));

        return $this->success($product, 'Product updated successfully');
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return $this->error('Product not found', 404);
        }

        $product->delete();

        return $this->success(null, 'Product deleted successfully');
    }
}