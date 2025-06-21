'use client';
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/db';
import { Category } from '@/db/schema';
import { eq, ilike } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import useFinanceStore from '@/app/_store/financeStore';
import { Loader2 } from 'lucide-react';

function CreateCategory() {
  const [emojiIcon, setEmojiIcon] = useState('😀');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const { fetchCategoryList } = useFinanceStore();

  const onCreateCategory = async () => {
    if (!name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error('User not authenticated');
      return;
    }

    try {
      setLoading(true);

      const existing = await db
        .select()
        .from(Category)
        .where(eq(Category.createdBy, user.primaryEmailAddress.emailAddress));

      const alreadyExists = existing.some(
        (cat) => cat.name.trim().toLowerCase() === name.trim().toLowerCase()
      );

      if (alreadyExists) {
        toast.error('Category with this name already exists');
        return;
      }

      await db.insert(Category).values({
        name: name.trim(),
        icon: emojiIcon,
        createdBy: user.primaryEmailAddress.emailAddress,
      });

      toast.success('Category created successfully!');
      setName('');
      setEmojiIcon('😀');
      setOpenEmojiPicker(false);
      fetchCategoryList(user.primaryEmailAddress.emailAddress);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while creating the category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5 sm:p-0'>
      {/* Emoji Picker */}
      <div className='relative'>
        <Button
          variant='outline'
          className='text-lg'
          onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
        >
          {emojiIcon}
        </Button>
        {openEmojiPicker && (
          <div className='absolute z-20 mt-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full md:w-[300px] max-h-[350px] overflow-y-auto'>
            <EmojiPicker
              width='100%'
              height='auto'
              onEmojiClick={(e) => {
                setEmojiIcon(e.emoji);
                setOpenEmojiPicker(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Input */}
      <div className='mt-2'>
        <p className='font-medium my-1'>Category Name</p>
        <Input
          placeholder='e.g. Home Decor'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Create Button */}
      <Button
        disabled={!name.trim() || loading}
        onClick={onCreateCategory}
        className='mt-5 w-full rounded-full flex items-center justify-center'
      >
        {loading ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Creating...
          </>
        ) : (
          'Create Category'
        )}
      </Button>
    </div>
  );
}

export default CreateCategory;
