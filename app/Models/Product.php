<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price'];

    protected static function booted()
    {
        static::creating(function ($model) {
            $ids = static::pluck('id')->sort()->values()->toArray();
            $next = 1;
            foreach ($ids as $id) {
                if ($id == $next) {
                    $next++;
                } else {
                    break;
                }
            }
            $model->id = $next;
        });
    }
}