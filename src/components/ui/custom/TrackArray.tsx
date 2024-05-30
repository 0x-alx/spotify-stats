"use client";
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableHeader,
} from "../table";
import Image from "next/image";
import { Skeleton } from "../skeleton";

const TrackArray = ({ data, isLoading }: { data: any; isLoading: boolean }) => {
	console.log("loading track array:", isLoading);
	return (
		<Table className='w-full'>
			<TableHeader>
				<TableRow>
					<TableHead>#</TableHead>
					<TableHead>Titre</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody className='overflow-y-scroll'>
				{isLoading &&
					[...Array(5)].map((_, index) => (
						<TableRow key={index}>
							<TableCell>
								<Skeleton className='size-[14px] rounded-sm' />
							</TableCell>
							<TableCell className='flex flex-row gap-2'>
								<Skeleton className='size-[50px] rounded-xl' />
								<div className='flex flex-col gap-1'>
									<Skeleton className='h-[14px] w-[250px] rounded-xl' />
									<Skeleton className='h-[12px] w-[250px] rounded-xl' />
								</div>
							</TableCell>
						</TableRow>
					))}
				{!isLoading &&
					data.map((track: any, index: number) => (
						<TableRow key={track.id}>
							<TableCell>{index + 1}</TableCell>
							<TableCell className='flex flex-row gap-2'>
								<Image
									src={track.album.images[0].url}
									alt={track.name}
									width={50}
									height={50}
									className='rounded-md'
								/>
								<div className='truncate'>
									<p className='text-sm'>{track.name}</p>
									<p className='text-xs'>
										{track.artists[0].name}
									</p>
								</div>
							</TableCell>
						</TableRow>
					))}
			</TableBody>
		</Table>
	);
};

export default TrackArray;
